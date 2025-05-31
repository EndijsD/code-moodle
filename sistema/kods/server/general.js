import express from 'express'
import db from './db.js'
import moment from 'moment'
import bcrypt from 'bcrypt'
import { authenticateSession } from './auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const table = req.baseUrl.slice(1)

  db.query(`SELECT * FROM ??`, table, (err, result) => {
    if (err) {
      res.status(500).json({ message: err.message })
    } else {
      res.send(result)
    }
  })
})

router.get('/:id', authenticateSession, async (req, res) => {
  const table = req.baseUrl.slice(1)
  const column = table + '_id'
  const id = req.params.id

  db.query(
    `SELECT * FROM ?? WHERE ?? = ?`,
    [table, column, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        res.json(result)
      }
    }
  )
})

router.post('/', authenticateSession, async (req, res) => {
  const table = req.baseUrl.slice(1)

  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 10)
  }

  const columns = Object.keys(req.body)
  const values = Object.values(req.body)

  db.query(
    `INSERT INTO ?? (??) VALUES (?)`,
    [table, columns, values],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        res.json({ message: 'Added entry', id: result.insertId })
      }
    }
  )
})

router.post('/multiple', authenticateSession, async (req, res) => {
  const table = req.baseUrl.slice(1)
  let data = req.body

  if (!Array.isArray(data) || data.length == 0) {
    return res
      .status(400)
      .json({ message: 'Request body must be an array of objects' })
  }

  const columns = Object.keys(data[0])
  const values = data.map((row) => columns.map((col) => row[col]))

  const placeholders = values
    .map(() => '(' + columns.map(() => `?`).join(', ') + ')')
    .join(', ')

  db.query(
    `INSERT INTO ?? (??) VALUES ${placeholders}`,
    [table, columns, ...values.flat()],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        const insertIds = Array.from(
          { length: result.affectedRows },
          (_, i) => result.insertId + i
        )

        res.json({
          message: 'Added entries',
          affectedRows: result.affectedRows,
          insertIds: insertIds,
        })
      }
    }
  )
})

const isNumeric = (str) => {
  if (typeof str != 'string') return false
  return !isNaN(str) && !isNaN(parseFloat(str))
}

router.patch('/single/:id', authenticateSession, async (req, res) => {
  const table = req.baseUrl.slice(1)
  const column = table + '_id'
  const id = req.params.id

  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 10)
  }

  const columns = Object.keys(req.body)
  const columnSetters = Object.keys(req.body)
    .map(() => '?? = ?')
    .join(', ')

  const values = Object.values(req.body).map((value) =>
    !isNumeric(value) && moment(value, moment.ISO_8601, true).isValid()
      ? moment(value).format('YYYY-MM-DD HH:mm:ss')
      : value && (value.constructor === Array || typeof value === 'object')
      ? JSON.stringify(value)
      : value
  )

  const setters = columns.flatMap((col, i) => [col, values[i]])

  db.query(
    `UPDATE ?? SET ${columnSetters} WHERE ?? = ?`,
    [table, ...setters, column, id],
    (err) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        res.json({ message: 'Updated entry: ' + id })
      }
    }
  )
})

router.patch('/multiple', authenticateSession, async (req, res) => {
  const table = req.baseUrl.slice(1)
  const column = table + '_id'
  const updates = req.body

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ message: 'Invalid updates array' })
  }

  const queries = updates
    .map((update) => {
      const id = update[column]
      delete update[column]

      if (!id || Object.keys(update).length === 0) {
        return null
      }

      if (update.password) {
        update.password = bcrypt.hashSync(update.password, 10)
      }

      const columns = Object.keys(update)
      const columnSetters = columns.map((col) => `\`${col}\` = ?`).join(', ')
      const values = Object.values(update).map((value) =>
        !isNumeric(value) && moment(value, moment.ISO_8601, true).isValid()
          ? moment(value).format('YYYY-MM-DD HH:mm:ss')
          : value && (value.constructor === Array || typeof value === 'object')
          ? JSON.stringify(value)
          : value
      )

      return {
        query: `UPDATE \`${table}\` SET ${columnSetters} WHERE \`${column}\` = ?`,
        values: [...values, id],
      }
    })
    .filter(Boolean)

  if (queries.length === 0) {
    return res.status(400).json({ message: 'No valid updates' })
  }

  const executeQueries = queries.map(
    ({ query, values }) =>
      new Promise((resolve, reject) => {
        db.query(query, values, (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
  )

  Promise.all(executeQueries)
    .then(() => res.json({ message: 'Updated entries successfully' }))
    .catch((err) => res.status(500).json({ message: err.message }))
})

router.delete('/single/:id', authenticateSession, async (req, res) => {
  const table = req.baseUrl.slice(1)
  const column = table + '_id'
  const id = req.params.id

  db.query(`DELETE FROM ?? WHERE ?? = ?`, [table, column, id], (err) => {
    if (err) {
      res.status(500).json({ message: err.message })
    } else {
      res.json({ message: 'Deleted entry: ' + id })
    }
  })
})

router.delete('/multiple', authenticateSession, async (req, res) => {
  const table = req.baseUrl.slice(1)
  const column = table + '_id'
  const ids = req.body

  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ message: 'Request body must be an array of ids' })
  }

  db.query(`DELETE FROM ?? WHERE ?? IN (?)`, [table, column, ids], (err) => {
    if (err) {
      res.status(500).json({ message: err.message })
    } else {
      res.json({ message: `Deleted entries: ${ids.join(', ')}` })
    }
  })
})
export default router

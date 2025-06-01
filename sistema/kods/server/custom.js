import express from 'express'
import db from './db.js'
import { authenticateSession } from './auth.js'

const router = express.Router()

router.get('/newStudents', authenticateSession, (req, res) => {
  const id = req.user.skolotajs_id

  db.query(
    `select st.studenti_id, vards, uzvards, klase, epasts, st.skolas_id, nosaukums, tips
    from studenti st
    join lietotajs l on l.lietotajs_id = st.lietotajs_id
    join skolas sk on st.skolas_id = sk.skolas_id
    join skolotajs_students ss on ss.studenti_id = st.studenti_id
    where ss.skolotajs_id = ? and akceptets IS NULL`,
    id,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        res.send(result)
      }
    }
  )
})

router.patch('/acceptOrReject/:id', authenticateSession, (req, res) => {
  const id = req.user.skolotajs_id
  const { akceptets } = req.body
  const studenti_id = req.params.id

  db.query(
    `UPDATE skolotajs_students SET akceptets = ? WHERE skolotajs_id = ? and studenti_id = ?`,
    [akceptets, id, studenti_id],
    (err) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        res.json({ message: 'Updated entry: ' + id })
      }
    }
  )
})

router.get('/modules_tasks/:id', authenticateSession, (req, res) => {
  let id

  if (req.params.id) id = req.params.id
  else id = req.user.studenti_id

  db.query(
    `select concat(l.vards, " ", l.uzvards) as vardsUzvards, m.nosaukums as m_nos, u.uzdevumi_id, tema, u.nosaukums as u_nos, u.punkti as u_punkti, i.punkti as i_punkti, m.moduli_id
    from studenti s
    join lietotajs l on s.lietotajs_id = l.lietotajs_id
    join moduli_studenti ms on ms.studenti_id = s.studenti_id
    join moduli m on m.moduli_id = ms.moduli_id
    join moduli_uzdevumi mu on mu.moduli_id = m.moduli_id
    join uzdevumi u on u.uzdevumi_id = mu.uzdevumi_id
    left join iesniegumi i on i.uzdevumi_id = u.uzdevumi_id and i.moduli_id = m.moduli_id
    where s.studenti_id = ?`,
    id,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        const transformedArr = result.reduce((res, el) => {
          const existingItem = res.find((i) => i.m_nos == el.m_nos)

          const taskPoints = el.u_punkti
          const gottenPoints = el.i_punkti

          const moduleName = el.m_nos
          delete el.m_nos

          const moduleID = el.moduli_id
          delete el.moduli_id

          const fullName = el.vardsUzvards
          delete el.vardsUzvards

          if (existingItem) {
            existingItem.p_kopa += el.u_punkti
            existingItem.i_kopa += el.i_punkti
            existingItem.uzdevumi.push(el)
          } else
            res.push({
              moduli_id: moduleID,
              m_nos: moduleName,
              p_kopa: taskPoints,
              i_kopa: gottenPoints,
              vardsUzvards: fullName,
              uzdevumi: [{ ...el }],
            })

          return res
        }, [])

        res.send(transformedArr)
      }
    }
  )
})

router.get('/tasks_of_module/:id', authenticateSession, (req, res) => {
  const id = req.params.id

  db.query(
    `SELECT uzdevumi.*
    FROM uzdevumi INNER JOIN moduli_uzdevumi 
    ON moduli_uzdevumi.uzdevumi_id = uzdevumi.uzdevumi_id
    WHERE moduli_uzdevumi.moduli_id = ?`,
    id,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        res.send(result)
      }
    }
  )
})

router.delete('/removeTask/:id/:taskId', authenticateSession, (req, res) => {
  const id = req.params.id
  const taskId = req.params.taskId
  db.query(
    `DELETE FROM moduli_uzdevumi WHERE uzdevumi_id = ? and moduli_id = ?`,
    [taskId, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        res.send(result)
      }
    }
  )
})

router.get('/taskInfo/:id', authenticateSession, (req, res) => {
  const id = req.params.id

  db.query(
    `SELECT l.vards as vards, st.klase as klase ,l.uzvards as uzvards, sk.nosaukums as skola, sk.tips as tips, uzd.nosaukums as nosaukums, i.iesniegumi_id as iesniegumi_id 
    FROM studenti st
    JOIN lietotajs l ON st.lietotajs_id = l.lietotajs_id
    JOIN iesniegumi i ON i.studenti_id = st.studenti_id
    JOIN uzdevumi uzd ON uzd.uzdevumi_id = i.uzdevumi_id
    JOIN skolas sk ON sk.skolas_id = st.skolas_id
    JOIN skolotajs skol ON skol.skolotajs_id = uzd.skolotajs_id
    JOIN skolotajs_students skst ON skst.studenti_id = st.studenti_id
    WHERE skol.skolotajs_id = ? AND skst.akceptets = 1;
`,
    [id],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        res.send(result)
      }
    }
  )
})

router.get('/generalStudentInfo/:id', authenticateSession, (req, res) => {
  const id = req.params.id

  db.query(
    `SELECT s.studenti_id as studenti_id, l.vards as vards, l.uzvards as uzvards, skolas.nosaukums as skola, s.klase as klase, skolas.tips as tips
FROM studenti s
JOIN lietotajs l ON s.lietotajs_id = l.lietotajs_id
JOIN skolas ON s.skolas_id = skolas.skolas_id
JOIN skolotajs_students skst ON skst.studenti_id = s.studenti_id
WHERE skst.skolotajs_id = 1 AND skst.akceptets = 1`,
    [id],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        res.send(result)
      }
    }
  )
})

router.get('/singleTask', authenticateSession, (req, res) => {
  const userID = req.user.studenti_id
  const moduleID = req.query.moduleID
  const taskID = req.query.taskID

  db.query(
    `select i.iesniegumi_id, i.punkti as i_punkti, u.punkti as u_punkti, datums, atbilde, tema, u.nosaukums, apraksts, valoda, piemers
    from moduli_studenti ms
    join moduli m on m.moduli_id = ms.moduli_id
    join moduli_uzdevumi mu on mu.moduli_id = m.moduli_id
    join uzdevumi u on u.uzdevumi_id = mu.uzdevumi_id
    left join iesniegumi i on i.uzdevumi_id = u.uzdevumi_id and i.moduli_id = m.moduli_id
    where ms.studenti_id = ? and m.moduli_id = ? and u.uzdevumi_id = ?`,
    [userID, moduleID, taskID],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        if (result.length < 1) {
          res.status(404).json({ message: 'Task not found' })
          return
        }

        res.send(result[0])
      }
    }
  )
})

router.get('/singleTask/:subID', authenticateSession, (req, res) => {
  const subID = req.params.subID

  db.query(
    `select i.punkti as i_punkti, u.punkti as u_punkti, datums, atbilde, tema, u.nosaukums, apraksts, valoda, piemers
    from iesniegumi i
    join uzdevumi u on u.uzdevumi_id = i.uzdevumi_id
    where i.iesniegumi_id = ?`,
    subID,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        res.send(result[0])
      }
    }
  )
})

router.get('/comments/:subID', authenticateSession, (req, res) => {
  const subID = req.params.subID

  db.query(
    `select concat(vards, ' ', uzvards) as sutitajs, komentars, ir_students, k.datums as k_datums
    from komentari k
    join iesniegumi i on i.iesniegumi_id = k.iesniegumi_id
    join studenti s on s.studenti_id = i.studenti_id
    join lietotajs l on l.lietotajs_id = s.lietotajs_id
    where k.iesniegumi_id = ?
    order by k_datums`,
    subID,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        res.send(result)
      }
    }
  )
})

router.post('/studentModules', authenticateSession, async (req, res) => {
  const keys = Object.keys(req.body).toString()
  const values = Object.values(req.body)

  db.query(
    `select studenti_id from moduli_studenti where studenti_id = ? and moduli_id = ?`,
    [req.body.studenti_id, req.body.moduli_id],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
        console.log(err)
      } else {
        if (result.length == 0) {
          db.query(
            `INSERT INTO moduli_studenti (${keys}) VALUES (?)`,
            [values],
            (err, result) => {
              if (err) {
                res.status(500).json({ message: err.message })
                console.log(err)
              } else {
                res.json({ message: 'Added entry' })
              }
            }
          )
        }
      }
    }
  )
})

router.get('/tasks/:id', authenticateSession, (req, res) => {
  let id = req.params.id

  db.query(
    `select uzdevumi_id, tema, nosaukums, apraksts, valoda, punkti 
    from uzdevumi 
    where skolotajs_id = ?`,
    id,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        res.send(result)
      }
    }
  )
})

router.delete('/removeTask/:id', authenticateSession, async (req, res) => {
  const id = req.params.id

  db.query(`DELETE FROM moduli_uzdevumi WHERE moduli_id = ?`, [id], (err) => {
    if (err) {
      res.status(500).json({ message: err.message })
    } else {
      res.json({ message: 'Deleted entry: ' + id })
    }
  })
})

// router.post('/student', authenticateSession, async (req, res) => {

//   if (req.body.password) {
//     req.body.password = bcrypt.hashSync(req.body.password, 10)
//   }

//   const columns = Object.keys(req.body)
//   const values = Object.values(req.body)

//   db.query(
//     `INSERT INTO lietotajs (??) VALUES (?)`,
//     [columns, values],
//     (err, result) => {
//       if (err) {
//         res.status(500).json({ message: err.message })
//       } else {
//         res.json({ message: 'Added entry', id: result.insertId })
//       }
//     }
//   )
// })

export default router

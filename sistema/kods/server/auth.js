import express from 'express'
import db from './db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  db.query(`SELECT * FROM lietotajs WHERE epasts = ?`, email, (err, result) => {
    if (err) res.status(500).json({ message: err.message })
    else {
      if (result.length < 1) {
        res.status(403).send({ message: 'Invalid credentials' })
        return
      }
      if (result.length > 1) {
        res.status(403).send({ message: 'Duplicate accounts' })
        return
      }

      const user = result[0]
      const isCorrectPass = bcrypt.compareSync(password, user.password)

      if (isCorrectPass) {
        const refreshToken = jwt.sign(
          { id: user.users_id },
          process.env.REFRESH_TOKEN_SECRET
        )

        db.query(
          `UPDATE lietotajs SET refresh_token = ? WHERE lietotajs_id = ?`,
          [refreshToken, user.users_id],
          (err) => {
            if (err) {
              res.status(500).json({ message: err.message })
            } else {
              const accessToken = jwt.sign(
                { id: user.users_id },
                process.env.ACCESS_TOKEN_SECRET
              )

              res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
              })
              res.cookie('accessToken', accessToken, {
                maxAge: 900000,
                httpOnly: true,
                sameSite: 'none',
                secure: true,
              })
              res.status(200).send({ id: user.users_id })
            }
          }
        )
      } else res.status(403).send({ message: 'Invalid credentials' })
    }
  })
})

router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) return res.status(401).json({ message: 'No token' })

  db.query(
    `SELECT refresh_token FROM lietotajs WHERE refresh_token = ?`,
    refreshToken,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        if (!result.length)
          return res.status(403).json({ message: 'Invalid token' })
        if (result[0].refresh_token != refreshToken)
          return res.status(403).json({ message: 'Invalid token' })

        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid token' })
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

            res.cookie('accessToken', accessToken, {
              maxAge: 900000,
              httpOnly: true,
              sameSite: 'none',
              secure: true,
            })
            res.sendStatus(200)
          }
        )
      }
    }
  )
})

router.post('/logout', async (req, res) => {
  db.query(
    `UPDATE lietotajs SET refresh_token = null WHERE refresh_token = ?`,
    req.cookies.refreshToken,
    (err) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        res.send({ message: 'Logged out' })
      }
    }
  )
})

router.get('/check', (req, res) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) return res.sendStatus(401)

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' })
    } else {
      res.status(200) // .json({ id: user.id })
    }
  })
})

export const authenticateSession = (req, res, next) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) return res.sendStatus(401)

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' })
    } else {
      req.user = user
      next()
    }
  })
}

export default router

import express from 'express'
import db from './db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  db.query(
    `SELECT l.*, sk.skolotajs_id, sk.skolas_id, st.klase, st.skolas_id, st.studenti_id, a.administrators_id, a.skolas_id
    FROM lietotajs l
    left join skolotajs sk on sk.lietotajs_id = l.lietotajs_id
    left join studenti st on st.lietotajs_id = l.lietotajs_id
    left join administrators a on a.lietotajs_id = l.lietotajs_id
    WHERE epasts = ?`,
    email,
    (err, result) => {
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

        const user = { ...result[0] }

        const { parole: hash_password, lietotajs_id: id } = user
        const isCorrectPass = bcrypt.compareSync(password, hash_password)

        Object.keys(user).forEach((key) => {
          if (user[key] === null) delete user[key]
        })
        delete user.refresh_token
        delete user.parole

        if (isCorrectPass) {
          const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

          db.query(
            `UPDATE lietotajs SET refresh_token = ? WHERE lietotajs_id = ?`,
            [refreshToken, id],
            (err) => {
              if (err) {
                res.status(500).json({ message: err.message })
              } else {
                const accessToken = jwt.sign(
                  user,
                  process.env.ACCESS_TOKEN_SECRET
                )

                res.cookie('refreshToken', refreshToken, {
                  httpOnly: true,
                  sameSite: 'strict',
                })
                res.cookie('accessToken', accessToken, {
                  maxAge: 900000,
                  httpOnly: true,
                  sameSite: 'strict',
                })

                res.status(200).send(user)
              }
            }
          )
        } else res.status(403).send({ message: 'Invalid credentials' })
      }
    }
  )
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
              sameSite: 'strict',
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
        res.clearCookie('refreshToken', {
          httpOnly: true,
          sameSite: 'strict',
        })
        res.clearCookie('accessToken', {
          httpOnly: true,
          sameSite: 'strict',
        })
        res.send({ message: 'Logged out' })
      }
    }
  )
})

router.get('/check', (req, res) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) return res.sendStatus(401)

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' })
    } else {
      res.status(200).json(user)
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

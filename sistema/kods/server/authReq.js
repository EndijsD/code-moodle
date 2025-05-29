import express from 'express';
import db from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/login', async (req, res) => {
  const tables = ['studenti', 'skolotajs'];
  const email = req.body.email;
  const password = req.body.password;
  let sent = false;

  for (let i = 0; i < 2; i++) {
    db.query(
      `SELECT * FROM ${tables[i]} WHERE epasts=?`,
      email,
      (err, result) => {
        if (err && i == 1) {
          res.status(500).json({ message: err.message });
          sent = true;
          i = 2;
        } else {
          const resultObj = result[0];

          if (resultObj) {
            const isCorrectPass = bcrypt.compareSync(
              password,
              resultObj.parole
            );

            if (isCorrectPass) {
              if (i == 1 || (i == 0 && resultObj.akceptets)) {
                const accessToken = jwt.sign(
                  {
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
                    data: resultObj,
                  },
                  process.env.ACCESS_TOKEN_SECRET
                );

                res.send({
                  accessToken: accessToken,
                  userType: i,
                  userID: resultObj.studenti_id,
                });
                sent = true;
                i = 2;
              } else {
                res.send({ userType: i });
                sent = true;
                i = 2;
              }
            } else {
              if (i == 1) {
                res.send({ problem: 'Incorrect data' });
                sent = true;
                i = 2;
              }
            }
          } else {
            if (i == 1 && !sent) {
              res.send({ problem: 'Incorrect data' });
              sent = true;
            }
          }
        }
      }
    );
  }
});

export default router;

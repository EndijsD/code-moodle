import express from "express";
import db from "./db.js";
import moment from "moment";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/login", async (req, res) => {
  // Iegūst vajadzīgās vērtības no padotās informācijas
  const table = req.body.table;
  const email = req.body.email;
  const password = req.body.password;

  // Veic vaicājumu datubāzei, kur iegūst ierakstu ar padoto e-pastu
  db.query(`SELECT * FROM ${table} WHERE epasts=?`, email, (err, result) => {
    if (err) {
      // Ja ir problēma, tad sūta atpakaļ problēmas ziņu
      res.status(500).json({ message: err.message });
    } else {
      // Iegūst pirmā elementa objektu, jo vaicājumi vienmēr ir masīvi ar ierakstiem, ja tādi ir atrasti
      const resultObj = result[0];

      if (resultObj) {
        // Ja ir ieraksts ar norādīto e-pasta adresi, tad vertificējam paroli,
        // ko lietotājs ievadīja, ar to kas ir datubāzē, savādāk nosūtam tukšu objektu
        const isCorrectPass = bcrypt.compareSync(password, resultObj.parole);

        if (isCorrectPass) {
          // Ja parole sakrīt ar to kas ir datubāzē, tad izveidojam JWT un nosūtam to atpakaļ,
          // savādāk nosūtam tukšu objektu
          const accessToken = jwt.sign(
            resultObj,
            process.env.ACCESS_TOKEN_SECRET
          );
          res.send({ accessToken: accessToken });
        } else {
          res.send({});
        }
      } else {
        res.send({});
      }
    }
  });
});

export default router;

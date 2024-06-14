import express from 'express';
import db from './db.js';

const router = express.Router();

router.get('/newStudents', (req, res) => {
  db.query(
    `select studenti_id, vards, uzvards, klase, epasts, st.skolas_id, nosaukums, tips from studenti st join skolas sk on st.skolas_id = sk.skolas_id where akceptets = false`,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        res.send(result);
      }
    }
  );
});

export default router;

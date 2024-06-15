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

router.get('/taskInfo', (req, res) => {
  db.query(
    `SELECT st.vards, st.uzvards, st.klase, sk.nosaukums as "skola", sk.tips, i.iesniegumi_id, uzd.nosaukums
FROM studenti st INNER JOIN skolas sk  ON st.skolas_id = sk.skolas_id
INNER JOIN iesniegumi i ON i.studenti_id = st.studenti_id
INNER JOIN uzdevumi uzd ON uzd.uzdevumi_id = i.uzdevumi_id
WHERE st.akceptets = 1 AND i.punkti is NULL;`,
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

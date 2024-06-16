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

router.get('/modules_tasks/:id', (req, res) => {
  const id = req.params.id;

  db.query(
    `select m.nosaukums as m_nos, u.uzdevumi_id, tema, u.nosaukums as u_nos from moduli_studenti ms join moduli m on m.moduli_id = ms.moduli_id join moduli_uzdevumi mu on mu.moduli_id = m.moduli_id join uzdevumi u on u.uzdevumi_id = mu.uzdevumi_id where ms.studenti_id = ?`,
    id,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        const transformedArr = result.reduce((res, el) => {
          const existingItem = res.find((i) => i.m_nos == el.m_nos);

          const moduleName = el.m_nos;
          delete el.m_nos;

          if (existingItem) existingItem.uzdevumi.push(el);
          else res.push({ m_nos: moduleName, uzdevumi: [{ ...el }] });

          return res;
        }, []);

        res.send(transformedArr);
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

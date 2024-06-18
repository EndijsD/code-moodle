import express from 'express';
import db from './db.js';

const router = express.Router();

router.get('/newStudents', (req, res) => {
  db.query(
    `select studenti_id, vards, uzvards, klase, epasts, st.skolas_id, nosaukums, tips
    from studenti st
    join skolas sk on st.skolas_id = sk.skolas_id
    where akceptets = false`,
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
    `select m.nosaukums as m_nos, u.uzdevumi_id, tema, u.nosaukums as u_nos, u.punkti as u_punkti, i.punkti as i_punkti, m.moduli_id
    from moduli_studenti ms
    join moduli m on m.moduli_id = ms.moduli_id
    join moduli_uzdevumi mu on mu.moduli_id = m.moduli_id
    join uzdevumi u on u.uzdevumi_id = mu.uzdevumi_id
    left join iesniegumi i on i.uzdevumi_id = u.uzdevumi_id and i.moduli_id = m.moduli_id
    where ms.studenti_id = ?`,
    id,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        const transformedArr = result.reduce((res, el) => {
          const existingItem = res.find((i) => i.m_nos == el.m_nos);

          const taskPoints = el.u_punkti;
          const gottenPoints = el.i_punkti;

          const moduleName = el.m_nos;
          delete el.m_nos;

          const moduleID = el.moduli_id;
          delete el.moduli_id;

          if (existingItem) {
            existingItem.p_kopa += el.u_punkti;
            existingItem.i_kopa += el.i_punkti;
            existingItem.uzdevumi.push(el);
          } else
            res.push({
              moduli_id: moduleID,
              m_nos: moduleName,
              p_kopa: taskPoints,
              i_kopa: gottenPoints,
              uzdevumi: [{ ...el }],
            });

          return res;
        }, []);

        res.send(transformedArr);
      }
    }
  );
});

router.get('/taskInfo', (req, res) => {
  db.query(
    `SELECT st.vards, st.uzvards, st.klase, sk.nosaukums as skola, sk.tips, i.iesniegumi_id, uzd.nosaukums
    FROM studenti st
    JOIN skolas sk  ON st.skolas_id = sk.skolas_id
    JOIN iesniegumi i ON i.studenti_id = st.studenti_id
    JOIN uzdevumi uzd ON uzd.uzdevumi_id = i.uzdevumi_id
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

router.get('/singleTask/:userID/:moduleID/:taskID', (req, res) => {
  const userID = req.params.userID;
  const moduleID = req.params.moduleID;
  const taskID = req.params.taskID;

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
        res.status(500).json({ message: err.message });
      } else {
        res.send(result[0]);
      }
    }
  );
});

router.get('/singleTask/:subID', (req, res) => {
  const subID = req.params.subID;

  db.query(
    `select i.punkti as i_punkti, u.punkti as u_punkti, datums, atbilde, tema, u.nosaukums, apraksts, valoda, piemers
    from iesniegumi i
    join uzdevumi u on u.uzdevumi_id = i.uzdevumi_id
    where i.iesniegumi_id = ?`,
    subID,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        res.send(result[0]);
      }
    }
  );
});

router.get('/comments/:subID', (req, res) => {
  const subID = req.params.subID;

  db.query(
    `select concat(vards, ' ', uzvards) as sutitajs, komentars, ir_students, k.datums as k_datums
    from komentari k
    join iesniegumi i on i.iesniegumi_id = k.iesniegumi_id
    join studenti s on s.studenti_id = i.studenti_id
    where k.iesniegumi_id = ?
    order by k_datums`,
    subID,
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

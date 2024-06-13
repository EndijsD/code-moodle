import express from 'express';
import db from './db.js';

const router = express.Router();

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  db.query(`DELETE FROM moduli_uzdevumi where uzdevumi_id = ?;`, id, (err) => {
    if (err) {
      res.status(500).json({ message: err.message });
    }
  });
  db.query(`DELETE FROM atteli where uzdevumi_id = ?;`, id, (err) => {
    if (err) {
      res.status(500).json({ message: err.message });
    }
  });
  db.query(`DELETE FROM iesniegumi where uzdevumi_id = ?;`, id, (err) => {
    if (err) {
      res.status(500).json({ message: err.message });
    }
  });
  db.query(`DELETE FROM uzdevumi where uzdevumi_id = ?;`, id, (err) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.json({ message: 'Deleted entry related to task: ' + id });
    }
  });
});

export default router;

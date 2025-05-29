import express from 'express';
import db from './db.js';
import moment from 'moment';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/', async (req, res) => {
  const table = req.baseUrl.slice(1);

  db.query(`SELECT * FROM ${table}`, (err, result) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.send(result);
    }
  });
});

router.get('/:id', async (req, res) => {
  const table = req.baseUrl.slice(1);
  const id = req.params.id;

  db.query(
    `SELECT * FROM ${table} WHERE ${table}_id = ?`,
    id,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        res.json(result);
      }
    }
  );
});

router.post('/', async (req, res) => {
  const table = req.baseUrl.slice(1);
  if (req.body.parole) {
    req.body.parole = bcrypt.hashSync(req.body.parole, 10);
  }

  const keys = Object.keys(req.body).toString();
  const values = Object.values(req.body);

  db.query(
    `INSERT INTO ${table} (${keys}) VALUES (?)`,
    [values],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        res.json({ message: 'Added entry', id: result.insertId });
      }
    }
  );
});

const isNumeric = (str) => {
  if (typeof str != 'string') return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
};

router.patch('/:id', async (req, res) => {
  const table = req.baseUrl.slice(1);
  const id = req.params.id;

  if (req.body.parole) {
    req.body.parole = bcrypt.hashSync(req.body.parole, 10);
  }

  const keys = Object.keys(req.body)
    .map((key) => key + '=?')
    .toString();

  const values = Object.values(req.body).map((value) =>
    !isNumeric(value) && moment(value, moment.ISO_8601, true).isValid()
      ? moment(value).format('YYYY-MM-DD HH:mm:ss')
      : value && (value.constructor === Array || typeof value === 'object')
      ? JSON.stringify(value)
      : value
  );

  db.query(
    `UPDATE ${table} SET ${keys} WHERE ${table}_id = ?`,
    [...values, id],
    (err) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        res.json({ message: 'Updated entry: ' + id });
      }
    }
  );
});

router.delete('/:id', async (req, res) => {
  const table = req.baseUrl.slice(1);
  const id = req.params.id;

  db.query(`DELETE FROM ${table} WHERE ${table}_id = ?`, id, (err) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.json({ message: 'Deleted entry: ' + id });
    }
  });
});

export default router;

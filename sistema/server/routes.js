import express from 'express';
import requests from './requests.js';
import authReq from './authReq.js';
import customDeleteReq from './customDeleteReq.js';

const router = express.Router();

router.use('/auth', authReq);
router.use('/atteli', requests);
router.use('/iesniegumi', requests);
router.use('/komentari', requests);
router.use('/moduli', requests);
router.use('/moduli_students', requests);
router.use('/moduli_uzdevums', requests);
router.use('/skola', requests);
router.use('/skolotajs', requests);
router.use('/students', requests);
router.use('/uzdevumi', requests);
router.use('/task', customDeleteReq);

export default router;

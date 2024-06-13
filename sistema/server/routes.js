import express from 'express';
import requests from './requests.js';
import authReq from './authReq.js';
import customReq from './customReq.js';

const router = express.Router();

router.use('/custom', customReq);
router.use('/auth', authReq);
router.use('/skolotajs', requests);
router.use('/studenti', requests);
router.use('/atteli', requests);
router.use('/iesniegumi', requests);
router.use('/komentari', requests);
router.use('/moduli', requests);
router.use('/moduli_studenti', requests);
router.use('/moduli_uzdevumi', requests);
router.use('/skolas', requests);
router.use('/skolotajs_moduli', requests);
router.use('/uzdevumi', requests);

export default router;

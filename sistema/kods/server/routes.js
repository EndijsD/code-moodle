import express from 'express'
import general from './general.js'
import auth from './auth.js'
import custom from './custom.js'

const router = express.Router()

router.use('/auth', auth)
router.use('/custom', custom)

router.use('/lietotajs', general)
router.use('/administrators', general)
router.use('/skolotajs', general)
router.use('/studenti', general)
router.use('/fails', general)
router.use('/iesniegumi', general)
router.use('/komentari', general)
router.use('/moduli', general)
router.use('/moduli_studenti', general)
router.use('/moduli_uzdevumi', general)
router.use('/skolas', general)
router.use('/skolotajs_moduli', general)
router.use('/uzdevumi', general)

export default router

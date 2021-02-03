const express = require('express')
const router = express.Router();

//routers
const homeRoutes = require('./home')
const adminRoutes = require('./admin')

router.use('/admin', adminRoutes)
router.use('/', homeRoutes)

module.exports = router;
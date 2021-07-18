const express = require('express')
const router = express.Router();

//routers
const homeRoutes = require('./home')
const adminRoutes = require('./admin')
const authRoutes = require('./auth')
const callbacksRoute = require('./callbacks')
const panelRoutes = require('./user')


//middelwaer
const redirectIfNotAuth = require('../../http/middleware/redirectIfNotAuth')
const redirectIfAuth = require('../../http/middleware/redirectIfAuthed')
const redirectifNotAdmin = require('../../http/middleware/redirectIfNotAdmin')
router.use('/admin', redirectIfNotAuth.handel, redirectifNotAdmin.handel, adminRoutes)
router.use('/auth', redirectIfAuth.handel, authRoutes)
router.use('/callback', redirectIfAuth.handel, callbacksRoute)
router.use('/panel', redirectIfNotAuth.handel, panelRoutes)
router.use('/', homeRoutes)


module.exports = router;
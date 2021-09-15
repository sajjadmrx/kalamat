const express = require('express')
const router = express.Router();



const usersControllers = require('../../http/controllers/users');

//routers
const userRoutes = require('./user')
//middlewares
const redirectIfNotAuth = require('../../http/middleware/api/redirectIfNotAuth')
router.get('/getusers', usersControllers.getAllUsers)
router.use(redirectIfNotAuth.handel, userRoutes)
module.exports = router;
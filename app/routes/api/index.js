const express = require('express')
const router = express.Router();



const usersControllers = require('../../http/controllers/users');

//routers





router.get('/getusers', usersControllers.getAllUsers)

module.exports = router;
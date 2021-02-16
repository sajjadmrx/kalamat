const express = require('express')

const router = express.Router();

/* controllers */
const authControllers = require('../../http/controllers/auth/index')

// validator
const registerVaidator = require('../../http/validator/register')

router.get('/login', authControllers.pageLogin)
router.post('/login', authControllers.Login)
router.get('/register', authControllers.pageRegister)
router.post('/register', registerVaidator.handel(), authControllers.register)
module.exports = router;
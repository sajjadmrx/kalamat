const express = require('express');
const passport = require('passport');

const router = express.Router();

/* controllers */
const authControllers = require('../../http/controllers/auth/index')

// validator
const registerVaidator = require('../../http/validator/register')

router.get('/login', authControllers.pageLogin)
router.post('/login', authControllers.Login)


router.get('/register', authControllers.pageRegister)
router.post('/register', registerVaidator.handel(), authControllers.register)


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

module.exports = router;
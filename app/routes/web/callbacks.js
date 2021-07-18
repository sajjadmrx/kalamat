const express = require('express');
const passport = require('passport');

const router = express.Router();



router.get('/google', passport.authenticate('google', {
    failureRedirect: '/auth/login',
    successRedirect: '/panel'
}))
module.exports = router;
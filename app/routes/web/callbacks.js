const express = require('express');
const passport = require('passport');

const router = express.Router();



router.get('/google', passport.authenticate('google', {
    failureRedirect: '/auth/login',
    successRedirect: '/panel'
}))
router.get('/spotify', passport.authenticate('spotify', {
    failureRedirect: '/auth/login',
    successRedirect: '/panel',
    failWithError: true,

}))
module.exports = router;
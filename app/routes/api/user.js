



const express = require('express')
const router = express.Router();



const userControllers = require('../../http/controllers/users');
const settingControllers = require('../../http/controllers/user/settings');
const homeControllers = require('../../http/controllers/home');
//routers






router.post('/follow/:userId', userControllers.follow)
router.post('/unfollow/:userId', userControllers.unfollow)

router.post('/toggleLike/:id', userControllers.toggleLike)

router.post('/toggleBookmark/:id', userControllers.toggleBookmark)
router.delete('/sessions/:id', settingControllers.deleteSession)
module.exports = router;
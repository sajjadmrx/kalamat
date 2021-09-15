



const express = require('express')
const router = express.Router();



const userControllers = require('../../http/controllers/users');
const settingControllers = require('../../http/controllers/user/settings');
const homeControllers = require('../../http/controllers/home');
const chatControllers = require('../../http/controllers/user/chat')
const messagesControllers = require('../../http/controllers/user/messages')
//routers






router.post('/follow/:userId', userControllers.follow)
router.post('/unfollow/:userId', userControllers.unfollow)

router.post('/toggleLike/:id', userControllers.toggleLike)

router.post('/toggleBookmark/:id', userControllers.toggleBookmark)
router.delete('/sessions/:id', settingControllers.deleteSession)



router.get('/chats', chatControllers.getChats)
router.post('/chats', chatControllers.findOrCreateChat)
router.get('/chats/:id/messages', chatControllers.getMessages)


router.post('/messages', messagesControllers.addMessage)


module.exports = router;
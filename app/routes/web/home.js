const express = require('express');
const home = require('../../http/controllers/home');

const router = express.Router();

/* controllers */
const homeControllers = require('../../http/controllers/home')
const userControllers = require('../../http/controllers/users')

/* Validator */
const commentValidator = require('../../http/validator/comments')
router.get(['/', '/@'], homeControllers.index)
router.get(['/posts', '/p'], homeControllers.postsPage)

router.get('/:username', homeControllers.userProfile)
router.get('/:username/followers', homeControllers.followers)
router.get('/:username/following', homeControllers.following)


router.get('/p/:code', homeControllers.findByCode)
router.get('/:username/:code/:slug', homeControllers.singlePost)





/* comments */
router.post('/comment', commentValidator.handel(), homeControllers.comment)

router.post('/follow/:userId', userControllers.follow)
router.post('/unfollow/:userId', userControllers.unfollow)

router.post('/toggleLike/:id', homeControllers.toggleLike)

router.post('/toggleBookmark/:id', homeControllers.toggleBookmark)


router.get('/logOut', (req, res) => {
    req.logOut()
    res.redirect('/')
})
module.exports = router;
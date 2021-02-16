const express = require('express')

const router = express.Router();

/* controllers */
const homeControllers = require('../../http/controllers/home')

/* Validator */
const commentValidator = require('../../http/validator/comments')
router.get(['/', '/@'], homeControllers.index)
router.get(['/posts', '/p'], homeControllers.postsPage)

router.get('/:username', homeControllers.userProfile)
router.get('/p/:code', homeControllers.findByCode)
router.get('/:username/:code/:slug', homeControllers.singlePost)

/* comments */
router.post('/comment', commentValidator.handel(), homeControllers.comment)



router.get('/logOut', (req, res) => {
    req.logOut()
    res.redirect('/')
})
module.exports = router;
const express = require('express')

const router = express.Router();

/* controllers */
const homeControllers = require('../../http/controllers/home')

/* Validator */
const commentValidator = require('../../http/validator/comments')
router.get('/', homeControllers.index)
router.get(['/newses', '/n'], homeControllers.newsesPage)
router.get('/n/:code', homeControllers.findByCode)
router.get('/newses/:code', homeControllers.findByCode)
router.get('/newses/:code/:slug', homeControllers.singleNews)

/* comments */
router.post('/comment', commentValidator.handel(), homeControllers.comment)
module.exports = router;
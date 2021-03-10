const express = require('express')

const router = express.Router();

/* controllers */
const homeControllers = require('../../http/controllers/admin/home')
const newsControllers = require('../../http/controllers/admin/newsControllers')
const commentsControllers = require('../../http/controllers/admin/comments')
const usersControllers = require('../../http/controllers/admin/users')
const categoriesControllers = require('../../http/controllers/admin/categories')

/* middlewares */
const fileToFeild = require('../../http/middleware/fileToField')

/* helper */
const upload = require('../../http/helpers/uploadImages')

/* validator */
const createNewsValidator = require('../../http/validator/createNews')
router.use((req, res, next) => {
    res.locals.layout = 'admin/master'
    next()
})

router.get('/', homeControllers.index)
router.get('/news', newsControllers.newsPage)
router.get('/news/create', newsControllers.createNewsPage)
router.post('/news/create',
    upload.single('images'),
    fileToFeild.handel,
    createNewsValidator.handel(),
    newsControllers.createNews
)

router.get('/news/:id/edit', newsControllers.getForEdit)
router.put('/news/:id',
    upload.single('images'),
    fileToFeild.handel,
    createNewsValidator.handel(),
    newsControllers.updateNews)


router.get('/news/:id/togglePublished', newsControllers.togglePublished)
router.post('/file/post', (req, res) => {
    res.json('ho')
})

/// categorys

router.get('/categories', categoriesControllers.index)
router.get('/categories/create', categoriesControllers.pageCreate)
router.post('/categories/create', categoriesControllers.postCreate)



/* Comments */
router.get('/comments', commentsControllers.commentsPage)
router.get('/comments/:id/toggleApproved', commentsControllers.toggleApproved)
router.get('/comments/:id/edit', commentsControllers.getForEdit)
router.put('/comments/:id', commentsControllers.updateComment)
router.delete('/comments/:id', commentsControllers.deleteComment)

router.post('/comments/reply', commentsControllers.reply)

/* users */
router.get('/users', usersControllers.pageUsers)
router.get('/users/:id/toggleadmin', usersControllers.toggleApproved)
router.get('/users/create', usersControllers.pageCreateNewUser)
router.post('/users/create', usersControllers.createNewUser)

router.get('/profile', usersControllers.profile)
router.post('/profile', usersControllers.profilePost)





module.exports = router;
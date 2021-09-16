const express = require('express')

const router = express.Router();

/* controllers */
const homeControllers = require('../../http/controllers/admin/home')
const postsControllers = require('../../http/controllers/admin/postsControllers')
const commentsControllers = require('../../http/controllers/admin/comments')
const usersControllers = require('../../http/controllers/admin/users')
const categoriesControllers = require('../../http/controllers/admin/categories')

/* middlewares */
const fileToFeild = require('../../http/middleware/fileToField')

/* helper */
const upload = require('../../http/helpers/uploadImages')

/* validator */
const createPostValidator = require('../../http/validator/createPost')
router.use((req, res, next) => {
    res.locals.layout = 'admin/master'
    next()
})

router.get('/', homeControllers.index)
router.get('/posts', postsControllers.showPage)
router.get('/posts/create', postsControllers.createPostPage)
router.post('/posts/create',
    upload.post().single('images'),
    fileToFeild.handel,
    createPostValidator.handel(),
    postsControllers.createPost
)

router.get('/posts/:id/edit', postsControllers.getForEdit)
router.put('/posts/:id',
    upload.post().single('images'),
    fileToFeild.handel,
    createPostValidator.handel(),
    postsControllers.updatePost)


router.get('/posts/:id/togglePublished', postsControllers.togglePublished)
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
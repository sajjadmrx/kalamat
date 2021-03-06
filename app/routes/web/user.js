const express = require('express')

const router = express.Router();

/* controllers */

const indexController = require('../../http/controllers/user/index')
const postsController = require('../../http/controllers/user/posts')
const vrefyController = require('../../http/controllers/user/vrefy')
const commentsController = require('../../http/controllers/user/comments')
const boockMarksController = require('../../http/controllers/user/bookmarks')
const likesController = require('../../http/controllers/user/likes')
const chatsController = require('../../http/controllers/user/chat')


/* middlewares */
const fileToFeild = require('../../http/middleware/fileToField')
const checkVrefyed = require('../../http/middleware/checkVrefyd')
const redirectIfVrefyed = require('../../http/middleware/redirectIfVrefyed')

/* helper */
const upload = require('../../http/helpers/uploadImages')

/* validator */
const profValidator = require('../../http/validator/profile')

// settings
const settings = require('../../http/controllers/user/settings')


router.use((req, res, next) => {
    res.locals.layout = 'home/panel/master'
    next();
})


router.get('/', indexController.panel)

router.post('/',
    upload.profile().single('images'),
    fileToFeild.handel,
    profValidator.handel(),
    indexController.updatePanel
)




router.get('/posts', postsController.showMyPost)
router.get('/post/:id/edit', postsController.editMyPost)
router.put('/post/:id', upload.post().single('images'),
    fileToFeild.handel, postsController.update)

router.get('/post/:id/togglePublished', postsController.togglePublished)

///vrefy
router.get('/vrefyEmail', redirectIfVrefyed.handel, vrefyController.vrefy)
router.post('/vrefyEmail', redirectIfVrefyed.handel, vrefyController.postVrefy)
router.get('/vrefyEmail/:token', redirectIfVrefyed.handel, vrefyController.getToken)




//post

router.get('/addpost', (req, res, next) => {
    res.locals.layout = 'home/master'
    next();
}, checkVrefyed.handel, postsController.pageAddpost)
router.post('/addpost',
    checkVrefyed.handel,
    upload.post().single('images'),
    fileToFeild.handel,
    postsController.createPost
)

//comments

router.get('/comments', commentsController.comments)
/* Comments */
router.get('/comments/:id/toggleApproved', commentsController.toggleApproved)
router.get('/comments/:id/edit', commentsController.getForEdit)
router.put('/comments/:id', commentsController.updateComment)
router.delete('/comments/:id', commentsController.deleteComment)
router.post('/comments/reply', commentsController.reply)







/* bookmarks */
router.get('/bookmarks', boockMarksController.index)
router.get('/likes', likesController.index)

// settings
router.get('/settings', settings.showPage)


router.get('/chats', chatsController.showPage)



module.exports = router;
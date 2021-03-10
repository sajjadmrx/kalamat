const express = require('express')

const router = express.Router();

/* controllers */

const userpanel = require('../../http/controllers/users')

/* middlewares */
const fileToFeild = require('../../http/middleware/fileToField')
const checkVrefyed = require('../../http/middleware/checkVrefyd')
const redirectIfVrefyed = require('../../http/middleware/redirectIfVrefyed')

/* helper */
const upload = require('../../http/helpers/uploadImages')

/* validator */
const profValidator = require('../../http/validator/profile')
router.use((req, res, next) => {
    res.locals.layout = 'home/panel/master'
    next();
})
router.get('/', userpanel.panel)
router.post('/',
    upload.single('images'),
    fileToFeild.handel,
    profValidator.handel(),
    userpanel.postPanel
)
router.get('/posts', userpanel.showMyPost)
router.get('/post/:id/edit', userpanel.editMyPost)
router.put('/post/:id', upload.single('images'),
    fileToFeild.handel, userpanel.update)

router.get('/post/:id/togglePublished', userpanel.togglePublished)

///vrefy
router.get('/vrefyEmail', redirectIfVrefyed.handel, userpanel.vrefy)
router.post('/vrefyEmail', redirectIfVrefyed.handel, userpanel.postVrefy)
router.get('/vrefyEmail/:token', redirectIfVrefyed.handel, userpanel.getToken)



//post

router.get('/addpost', checkVrefyed.handel, userpanel.pageAddpost)
router.post('/addpost',
    checkVrefyed.handel,
    upload.single('images'),
    fileToFeild.handel,
    userpanel.createPost
)

//comments

router.get('/comments', userpanel.comments)
/* Comments */
router.get('/comments/:id/toggleApproved', userpanel.toggleApproved)
router.get('/comments/:id/edit', userpanel.getForEdit)
router.put('/comments/:id', userpanel.updateComment)
router.delete('/comments/:id', userpanel.deleteComment)

router.post('/comments/reply', userpanel.reply)

module.exports = router;
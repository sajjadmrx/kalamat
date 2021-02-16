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

router.get('/', userpanel.panel)
router.post('/',
    upload.single('images'),
    fileToFeild.handel,
    profValidator.handel(),
    userpanel.postPanel
)

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




module.exports = router;
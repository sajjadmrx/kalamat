const multer = require('multer')
const mkd = require('mkdirp')
const fs = require('fs')

const getAddressDr = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDay()

    return `./public/uploads/images/${year}/${month}/${day}`
}


const ImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        mkd.sync(getAddressDr())
        cb(null, getAddressDr())
    },
    filename: (req, file, cb) => {
        const pathImage = getAddressDr() + '/' + file.originalname
        if (!fs.existsSync(pathImage))
            cb(null, file.originalname)
        else
            cb(null, Date.now() + '-' + file.originalname)
    }
})

const uploadImage = multer({
    storage: ImageStorage
})

module.exports = uploadImage

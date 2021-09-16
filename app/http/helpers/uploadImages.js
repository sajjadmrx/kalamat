var multer = require('multer')
const mkd = require('mkdirp')
const fs = require('fs')


/// aws
const AWS = require('aws-sdk');
var multerS3 = require('multer-s3')
const awS = config.awS


const s3 = new AWS.S3({
    region: 'default',
    endpoint: awS.EndpointURL,
    accessKeyId: awS.AccessKey,
    secretAccessKey: awS.SecretKey,
});


const getKey = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDay()
    const time = Date.now()
    return `${year}_${month}_${day}_${time}`
}


// const ImageStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         mkd.sync(getAddressDr())
//         cb(null, getAddressDr())
//     },
//     filename: (req, file, cb) => {

//         const pathImage = getAddressDr() + '/' + file.originalname
//         if (!fs.existsSync(pathImage))
//             cb(null, file.originalname)
//         else
//             cb(null, Date.now() + '-' + file.originalname)
//     }
// })


class upload {
    post() {
        return multer({
            storage: multerS3({
                s3: s3,
                bucket: 'postskalamat',
                acl: 'public-read',
                contentDisposition: 'attachment',
                metadata: function (req, file, cb) {
                    /// validator

                    cb(null, { fieldName: file.fieldname })
                },
                key: function (req, file, cb) {
                    cb(null, getKey() + file.originalname)
                }
            })
        })
    }
    profile() {

        return multer({
            storage: multerS3({
                s3: s3,

                bucket: 'userskalamat',
                acl: 'public-read',
                contentDisposition: 'attachment',
                metadata: function (req, file, cb) {
                    if (file.size > 2 * 1014 * 1024) {
                        return cb(new Error('File too large'))
                    }
                    cb(null, { fieldName: file.fieldname })
                },
                key: function (req, file, cb) {
                    cb(null, getKey() + file.originalname)
                }
            })
        })
    }

    async removePhoto(params) {
        s3.deleteObject(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data);           // successful response
        });
    }
}


// const uploadImage = multer({
//     storage: ImageStorage
// })

module.exports = new upload()

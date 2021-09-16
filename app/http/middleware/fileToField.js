const middleware = require('./middleware');


class fileToField extends middleware {
    handel(req, res, next) {
        try {
            if (!req.file)
                req.body.images = undefined
            else
                req.body.images = req.file.key

            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new fileToField()
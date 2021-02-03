const middleware = require('./middleware');


class fileToField extends middleware {
    handel(req, res, next) {
        try {

            if (!req.file)
                req.body.images = undefined
            else
                req.body.images = req.file.destination.slice(8) + '/' + req.file.filename

            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new fileToField()
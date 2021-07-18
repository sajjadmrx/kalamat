const middleware = require('../middleware');


class redirectIfNotAuth extends middleware {
    handel(req, res, next) {
        try {

            if (!req.user)
                res.json({ code: 401, success: false, message: 'Not authorized' })
            else
                next()

        } catch (error) {
            next(error)
        }
    }
}

module.exports = new redirectIfNotAuth()
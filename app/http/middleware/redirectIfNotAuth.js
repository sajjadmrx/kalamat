const middleware = require('./middleware');


class redirectIfNotAuth extends middleware {
    handel(req, res, next) {
        try {

            if (!req.user)
                res.redirect('/auth/login')
            else
                next()

        } catch (error) {
            next(error)
        }
    }
}

module.exports = new redirectIfNotAuth()
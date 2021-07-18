const middleware = require('./middleware');


class redirectIfNotAuth extends middleware {
    handel(req, res, next) {
        try {

            if (req.user.isAdmin)
                next()
            else
                res.redirect('/')

        } catch (error) {
            next(error)
        }
    }
}

module.exports = new redirectIfNotAuth()
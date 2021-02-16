const middleware = require('./middleware');


class redirectIfAuth extends middleware {
    handel(req, res, next) {
        try {

            if (req.user)
                res.redirect('/')
            else
                next()

        } catch (error) {
            next(error)
        }
    }
}

module.exports = new redirectIfAuth()
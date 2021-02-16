const middleware = require('./middleware');


class checkVrefyd extends middleware {
    handel(req, res, next) {
        try {

            if (!req.user.isVrefyed)
                res.redirect('/panel/vrefyEmail')
            else
                next()

        } catch (error) {
            next(error)
        }
    }
}

module.exports = new checkVrefyd()
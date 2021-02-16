const middleware = require('./middleware');
const userModel = require('../../model/users')

class redirectIfVrefyed extends middleware {
    async handel(req, res, next) {
        try {
            const user = await userModel.findById(req.user.id)
            if (user.isVrefyed)
                return res.redirect('/')
            else
                next();
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new redirectIfVrefyed()
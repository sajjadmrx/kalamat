const controller = require('../controllers')
class home extends controller {
    async index(req, res, next) {
        try {
            res.render('admin/index')
        } catch (error) {
            next(error)
        }
    }


}

module.exports = new home()
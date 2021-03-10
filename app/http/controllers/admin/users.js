
const bcrypt = require('bcrypt')
const controller = require('../controllers')
//model
const usersModel = require('../../../model/users')

class users extends controller {



    async pageUsers(req, res, next) {
        try {
            const page = req.query.page || 1
            const users = await usersModel.paginate({}, { limit: 8, page })

            res.render('admin/users/index', { users })
        } catch (error) {
            next(error)
        }
    }

    async pageCreateNewUser(req, res, next) {
        try {
            res.render('admin/users/create')
        } catch (error) {
            next(error)
        }
    }

    async createNewUser(req, res, next) {
        try {
            const { password } = req.body
            delete req.body.password;
            const salt = await bcrypt.genSalt(10);
            const passHashid = await bcrypt.hashSync(password, salt)
            req.body.password = passHashid


            const user = new usersModel({
                ...req.body
            })
            user.isAdmin = false;
            await user.save()
            res.redirect('/admin/users')
        } catch (error) {
            next(error)
        }
    }

    async toggleApproved(req, res, next) {
        try {
            const id = req.params.id;
            const user = await usersModel.findById(id)
            user.set({ isAdmin: !user.isAdmin })
            await user.save()
            this.back(req, res)
        } catch (error) {
            next(error)
        }
    }

    async profile(req, res, next) {
        try {
            res.render('admin/users/userProfile')
        } catch (error) {
            next(error)
        }
    }
    async profilePost(req, res, next) {
        try {
            res.json(req.file)
        } catch (error) {
            next(error)
        }
    }



}

module.exports = new users()
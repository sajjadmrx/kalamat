const commentsModel = require('../../../model/comments')
const unique = require('unique-slug')
const uniqString = require('unique-string')
var GithubSlugger = require('github-slugger')
var slugger = new GithubSlugger()
const controller = require('../controllers')
const profileModel = require('../../../model/profile')
const vrefyEmailModel = require('../../../model/vrefyEmail')
const sendEmail = require('../../tools/sendEmail')
//model
const postModel = require('../../../model/postes')
const userModel = require('../../../model/users')
const categoriesModel = require('../../../model/categories')
class vrefy extends controller {

    async vrefy(req, res, next) {
        try {
            res.render('home/panel/vrefyEmail')
        } catch (error) {
            next(error)
        }
    }

    async postVrefy(req, res, next) {
        try {
            // -
            const uniq = uniqString()
            let token = `http://localhost:3000/panel/vrefyEmail/${uniq}`

            const user = await userModel.findById(req.user.id)
            if (user.isVrefed) {
                req.flash('errors', 'شما قبلا تایید شده اید.')
                return this.back(req, res)
            }
            const newVrefy = new vrefyEmailModel({
                user: req.user.id,
                token: uniq
            })
            ///process SendEmail
            sendEmail({ username: req.user.username, token: token }).catch(err => console.log(err))

            await newVrefy.save()
            this.back(req, res)
        } catch (error) {
            next(error)
        }
    }

    async getToken(req, res, next) {
        try {
            const token = req.params.token

            if (!token) return res.json('Token Not Found ') //alert



            const vrefyEmail = await vrefyEmailModel.findOne({ token: token }, {}, { populate: 'user' })

            if (!vrefyEmail) return res.json('Token Not Found ')

            if (vrefyEmail.used) return res.json('This link has expired')

            if (vrefyEmail.user.isVrefyed) return this.json('شما قبلا تایید شده اید')

            vrefyEmail.user.isVrefyed = true
            vrefyEmail.used = true
            await vrefyEmail.save()
            await vrefyEmail.user.save()
            res.redirect('/panel/addpost')

        } catch (error) {
            next(error)
        }
    }
}
module.exports = new vrefy()
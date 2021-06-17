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
const commentsModel = require('../../../model/comments')

class likes extends controller {


    async index(req, res, next) {
        try {
            const user = await userModel.findById(req.user.id, '-password', {
                populate: [{ path: 'liked', populate: [{ path: 'author', select: '-password', populate: 'profile' }] }]
            })
            const post = await user.liked

            res.render('home/panel/bookAndLike', { title: 'پسندیده ها', post })
        } catch (error) {
            next(error)
        }
    }


}

module.exports = new likes()
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

class boockMarks extends controller {


    async index(req, res, next) {
        try {
            const user = await userModel.findById(req.user.id, '-password', {
                populate: [{ path: 'bookmarks', populate: [{ path: 'author', select: '-password', populate: 'profile' }] }]
            })
            const post = await user.bookmarks

            res.render('home/panel/bookAndLike', { title: 'ذخیره شده ها', post })
        } catch (error) {
            next(error)
        }
    }


}

module.exports = new boockMarks()
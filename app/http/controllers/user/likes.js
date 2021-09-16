const unique = require('unique-slug')
const uniqString = require('unique-string')
var GithubSlugger = require('github-slugger')
var slugger = new GithubSlugger()
const controller = require('../controllers')
const profileModel = require('../../../model/profile')
const vrefyEmailModel = require('../../../model/vrefyEmail')
const sendEmail = require('../../tools/sendEmail')
//model
const usersModel = require('../../../model/users')
const categoriesModel = require('../../../model/categories')
const commentsModel = require('../../../model/comments')

class likes extends controller {


    async index(req, res, next) {
        try {


            const myUser = await res.locals.myUser.populate([{ path: 'liked', populate: [{ path: 'author', select: '-password', populate: 'profile' }] }])
            const liked = await myUser.liked

            res.render('home/panel/bookAndLike', { title: 'پسندیده ها', postes: liked, myUser })
        } catch (error) {
            next(error)
        }
    }


}

module.exports = new likes()
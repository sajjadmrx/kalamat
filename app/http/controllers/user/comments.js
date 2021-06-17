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
class comments extends controller {

    async comments(req, res, next) {
        try {
            const comments = await commentsModel.paginate({ user: req.user.id },
                { populate: [{ path: 'childs' }, { path: 'user', populate: 'profile' }, { path: 'post', populate: 'author' }, { path: 'parent' }] })


            res.render('home/panel/comments/index', { comments })
        } catch (error) {
            next(error)
        }
    }

    async reply(req, res, next) {
        try {

            const result = new commentsModel({
                ...req.body
            })

            await result.save()
            this.back(req, res)
        } catch (error) {
            next(error)
        }
    }

    async getForEdit(req, res, next) {
        try {
            const comment = await commentsModel.findById(req.params.id, {}, { populate: { path: 'user' } });
            if (!comment) return ''//alert

            res.render('home/panel/comments/edit', { comment })

        } catch (error) {
            next(error)
        }
    }

    async updateComment(req, res, next) {
        try {
            const { approved } = req.body
            delete req.body.approved
            delete req.body.name
            await commentsModel.findByIdAndUpdate(req.params.id, {
                ...req.body,
                approved: approved == 'on' ? true : false,
            })

            res.redirect('/panel/comments')
        } catch (error) {
            next(error)
        }
    }

    async toggleApproved(req, res, next) {
        try {
            const id = req.params.id;


            const comment = await commentsModel.findById(id)
            if (!comment) return res.json('404')//404
            comment.set({ approved: !comment.approved })
            await comment.save()
            this.back(req, res)
        } catch (error) {
            next(error)
        }
    }

    async deleteComment(req, res, next) {
        const comment = await commentsModel.findById(req.params.id, {}, {
            populate: [{ path: 'childs' }]
        })
        if (!comment) return ''// alert
        comment.childs.forEach(item => item.remove());

        await comment.remove();
        this.back(req, res)
    }

}
module.exports = new comments()
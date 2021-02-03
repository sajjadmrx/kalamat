const unique = require('unique-slug')
var GithubSlugger = require('github-slugger')
var slugger = new GithubSlugger()
const controller = require('../controllers')
//models
const commetnsModel = require('../../../model/comments')
class comments extends controller {

    async commentsPage(req, res, next) {
        try {
            let page = req.query.page || 1
            const comments = await commetnsModel.paginate({}, { limit: 4, page, populate: 'news' })
            res.render('admin/comments/index', { comments })
        } catch (error) {
            next(error)
        }
    }

    replyComments(req, res, next) {
        try {
            res.render('admin/news/create', { news: '' })
        } catch (error) {
            next(error)
        }
    }

    async reply(req, res, next) {
        try {

            const result = await this.checkValidator(req)
            if (!result)
                return this.back(req, res)

            const { published } = req.body
            delete req.body.published

            /* short link || slug */
            const code = unique()
            code.substr(4)


            const news = new newsModel({
                ...req.body,
                published: published == 'on' ? true : false,
                code: code.substr(4),
                slug: slugger.slug(req.body.title)
            })
            await news.save()
            res.redirect('/admin/news')
        } catch (error) {
            next(error)
        }
    }


    async getForEdit(req, res, next) {
        try {
            const comment = await commetnsModel.findById(req.params.id);
            if (!comment) return ''//alert

            res.render('admin/comments/edit', { comment })

        } catch (error) {
            next(error)
        }
    }



    async updateComment(req, res, next) {
        try {

            /*        const result = await this.checkValidator(req)
                   if (!result)
                       return this.back(req, res) */



            const { approved } = req.body
            delete req.body.approved
            await commetnsModel.findByIdAndUpdate(req.params.id, {
                ...req.body,
                approved: approved == 'on' ? true : false,
            })

            res.redirect('/admin/comments')
        } catch (error) {
            next(error)
        }
    }

    async toggleApproved(req, res, next) {
        try {


            const id = req.params.id
            let comments = await commetnsModel.findById(id)
            comments.approved = !comments.approved

            await comments.save()
            this.commentsPage(req, res, next)


        } catch (error) {
            next(error)
        }
    }

}

module.exports = new comments()
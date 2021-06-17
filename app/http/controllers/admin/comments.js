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
            const comments = await commetnsModel.paginate({}, {
                limit: 4, page, populate: [{ path: 'user' }, { path: 'post' }], sort: {
                    createdAt: -1
                }
            })


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

            const result = new commetnsModel({
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


    async deleteComment(req, res, next) {
        const comment = await commetnsModel.findById(req.params.id, {}, {
            populate: [{ path: 'childs' }]
        })
        if (!comment) return ''// alert
        comment.childs.forEach(item => item.remove());

        await comment.remove();
        this.back(req, res)
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
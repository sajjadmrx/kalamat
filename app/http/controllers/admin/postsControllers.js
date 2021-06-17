const unique = require('unique-slug')
var GithubSlugger = require('github-slugger')
var slugger = new GithubSlugger()
const controller = require('../controllers')
//models
const postesModel = require('../../../model/postes')
class posts extends controller {

    async showPage(req, res, next) {
        try {
            let page = req.query.page || 1
            const posts = await postesModel.paginate({}, { limit: 4, page })
            res.render('admin/posts/index', { posts })
        } catch (error) {
            next(error)
        }
    }

    createPostPage(req, res, next) {
        try {
            res.render('admin/posts/create', { news: '' })
        } catch (error) {
            next(error)
        }
    }

    async createPost(req, res, next) {
        try {

            const result = await this.checkValidator(req)
            if (!result)
                return this.back(req, res)

            const { published } = req.body
            delete req.body.published

            /* short link || slug */
            const code = unique()
            code.substr(4)


            const news = new postesModel({
                ...req.body,
                published: published == 'on' ? true : false,
                code: code.substr(4),
                slug: slugger.slug(req.body.title)
            })
            await news.save()
            res.redirect('/admin/posts')
        } catch (error) {
            next(error)
        }
    }


    async getForEdit(req, res, next) {
        try {
            const post = await postesModel.findById(req.params.id);
            if (!post) return ''//alert

            res.render('admin/posts/edit', { post })

        } catch (error) {
            next(error)
        }
    }



    async updatePost(req, res, next) {
        try {

            const result = await this.checkValidator(req)
            if (!result)
                return this.back(req, res)

            if (!req.body.images)
                delete req.body.images
            const { published } = req.body
            delete req.body.published
            await postesModel.findByIdAndUpdate(req.params.id, {
                ...req.body,
                published: published == 'on' ? true : false,
            })

            res.redirect('/admin/posts')
        } catch (error) {
            next(error)
        }
    }

    async togglePublished(req, res, next) {
        try {


            const id = req.params.id
            let post = await postesModel.findById(id)
            post.published = !post.published

            await post.save()
            this.showPage(req, res, next)


        } catch (error) {
            next(error)
        }
    }

}

module.exports = new posts()
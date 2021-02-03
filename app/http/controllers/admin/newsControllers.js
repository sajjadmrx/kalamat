const unique = require('unique-slug')
var GithubSlugger = require('github-slugger')
var slugger = new GithubSlugger()
const controller = require('../controllers')
//models
const newsModel = require('../../../model/news')
class news extends controller {

    async newsPage(req, res, next) {
        try {
            let page = req.query.page || 1
            const news = await newsModel.paginate({}, { limit: 4, page })
            res.render('admin/news/index', { news })
        } catch (error) {
            next(error)
        }
    }

    createNewsPage(req, res, next) {
        try {
            res.render('admin/news/create', { news: '' })
        } catch (error) {
            next(error)
        }
    }

    async createNews(req, res, next) {
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
            const news = await newsModel.findById(req.params.id);
            if (!news) return ''//alert

            res.render('admin/news/edit', { news })

        } catch (error) {
            next(error)
        }
    }



    async updateNews(req, res, next) {
        try {

            const result = await this.checkValidator(req)
            if (!result)
                return this.back(req, res)

            if (!req.body.images)
                delete req.body.images
            const { published } = req.body
            delete req.body.published
            await newsModel.findByIdAndUpdate(req.params.id, {
                ...req.body,
                published: published == 'on' ? true : false,
            })

            res.redirect('/admin/news')
        } catch (error) {
            next(error)
        }
    }

    async togglePublished(req, res, next) {
        try {


            const id = req.params.id
            let news = await newsModel.findById(id)
            news.published = !news.published

            await news.save()
            this.newsPage(req, res, next)


        } catch (error) {
            next(error)
        }
    }

}

module.exports = new news()
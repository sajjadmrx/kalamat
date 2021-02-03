const controller = require('./controllers')
const newsModel = require('../../model/news')
const commentsModel = require('../../model/comments')
class home extends controller {

    async index(req, res, next) {
        try {
            const news = await newsModel.paginate({ published: true }, { limit: 4, sort: { createAt: -1 } })

            res.render('home/index', { news })
        } catch (error) {
            next(error)
        }
    }


    async newsesPage(req, res, next) {
        try {
            const newses = await newsModel.paginate({ published: true }, { limit: 8, sort: { createAt: -1 } })


            res.render('home/newses', { newses })
        } catch (error) {
            next(error)
        }
    }

    async findByCode(req, res, next) {
        try {

            const code = req.params.code
            const news = await newsModel.findOne({ code: code }, {}, { published: true })
            res.render('home/single-news', { news })
        } catch (error) {
            next(error)
        }
    }

    async singleNews(req, res, next) {
        try {
            let page = req.query.page || 1
            const code = req.params.code
            const slug = req.params.slug
            const news = await newsModel.findOne({ code, slug }, {}, { published: true })
            const comments = await commentsModel.paginate(
                { news: news._id, approved: true, parent: null },
                { limit: 5, page, populate: [{ path: 'childs', match: { approved: true } }] })

            const tags = news.tags[0].split(',')
            res.render('home/single-news', { news, recaptcha: this.recaptcha.render(), comments, tags })
        } catch (error) {
            next(error)
        }
    }


    async comment(req, res, next) {
        try {

            await this.recaptchaValidator(req, res)
            ///validator
            const result = await this.checkValidator(req)
            if (!result) return this.back(req, res)
            // save 
            const comment = new commentsModel({ ...req.body })
            comment.approved = false;
            comment.save()
            // redirect
            req.flash('errors', 'انجام شد منتظر باشید تا تایید بشه ')
            this.back(req, res)
            //alert 


        } catch (error) {
            next(error)
        }
    }

}

module.exports = new home()
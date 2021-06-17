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
class posts extends controller {

    async pageAddpost(req, res, next) {
        try {
            const user = await userModel.findById(req.user?.id, {}, { populate: 'profile' })
            const categories = await categoriesModel.find({}, {}, { populate: 'parent' })

            res.render('home/panel/addPost', { user, categories })
        } catch (error) {
            next(error)
        }
    }

    async createPost(req, res, next) {
        try {
            const code = unique()
            code.substr(4)
            const published = req.body.published;
            delete req.body.published;
            const post = new postModel({
                ...req.body,
                slug: slugger.slug(req.body.title),
                code: code.substr(4),
                author: req.user.id,
                categories: req.body.categories,
                published: published == "on" ? true : false
            })
            await post.save()
            res.redirect('/panel/posts')
        } catch (error) {
            next(error)
        }
    }

    async showMyPost(req, res, next) {
        try {
            const page = req.query.page || 1
            const posts = await postModel.paginate({ author: req.user.id }, {
                limit: 5,
                page,
                populate: [{ path: 'author' }, {
                    path: 'categories'
                }]
            })
            res.render('home/panel/posts', { posts })
        } catch (error) {
            next(error)
        }
    }

    async editMyPost(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) return res.json('404')//404
            const post = await postModel.findById(id, {})
            if (!post) return res.json('404')//404
            const categories = await categoriesModel.find({}, {}, { populate: 'childs' })

            res.render('home/panel/editPost', { post, categories })
        } catch (error) {
            next(error)
        }
    }

    async update(req, res, next) {
        try {
            const { images } = req.body;
            if (!images)
                delete req.body.images;

            const published = req.body.published;
            delete req.body.published;


            const post = await postModel.findByIdAndUpdate(req.params.id, { $set: { ...req.body, published: published == "on" ? true : false } })
            if (!post) return res.json('404')//404

            res.redirect('/panel/posts')
        } catch (error) {
            next(error)
        }
    }


    async togglePublished(req, res, next) {
        try {
            const id = req.params.id;


            const post = await postModel.findById(id)
            if (!post) return res.json('404')//404
            post.set({ published: !post.published })
            await post.save()
            this.back(req, res)
        } catch (error) {
            next(error)
        }
    }


}
module.exports = new posts()
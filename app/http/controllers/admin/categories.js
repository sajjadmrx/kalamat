const controller = require('../controllers')
const categoriesModel = require('../../../model/categories')

var GithubSlugger = require('github-slugger')
var slugger = new GithubSlugger()
class categories extends controller {

    async index(req, res, next) {
        try {
            let page = req.query.page || 1
            const categories = await categoriesModel.paginate({}, {
                limit: 10, page, populate: 'parent',
                sort: { parent: null, createdAt: -1 }
            })
            res.render('admin/categories/index', { categories })
        } catch (error) {
            next(error)
        }
    }

    async pageCreate(req, res, next) {
        try {

            const categories = await categoriesModel.find()
            res.render('admin/categories/create', { categories })
        } catch (error) {
            next(error)
        }
    }


    async postCreate(req, res, next) {
        try {

            let category = await categoriesModel.findOne({ name: req.body.name })
            if (category) {
                req.flash('errors', "یک دسته از قبل با این نام ساخته شده است")
                return this.back(req, res)
            }
            const { parent } = req.body

            category = new categoriesModel({
                name: req.body.name,
                slug: slugger.slug(req.body.name),
                parent: parent == "none" ? null : parent
            })
            await category.save()
            res.redirect('/admin/categories')
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new categories()
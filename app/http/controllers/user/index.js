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





class panel extends controller {


    async panel(req, res, next) {
        try {
            const user = await userModel.findById(req.user.id, {}, {
                populate: [{ path: 'profile' }, { path: 'posts' }]
            })

            res.render('home/panel/index', { user })
        } catch (error) {
            next(error)
        }
    }




    async updatePanel(req, res, next) {
        try {
            const result = await this.checkValidator(req)
            if (!result)
                return this.back(req, res)

            const user = await userModel.findById(req.user.id, {}, { populate: 'profile' })
            let { name, email, phone, website, bio, images } = req.body
            console.log(images);
            if (user.profile) {
                if (!images)
                    delete req.body.images

                user.set({ ...req.body })
                user.profile.set({ ...req.body })
                await user.save()
                await user.profile.save()
            }
            else {
                user.set({ ...req.body })
                const newProfil = new profileModel({
                    user: req.user.id,
                    images,
                    bio,
                    website
                })
                await user.save()
                await newProfil.save()
            }

            this.back(req, res)

        } catch (error) {
            next(error)
        }
    }


}

module.exports = new panel()
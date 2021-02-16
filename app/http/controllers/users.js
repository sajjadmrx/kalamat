const unique = require('unique-slug')
var GithubSlugger = require('github-slugger')
const uniqString = require('unique-string')
var slugger = new GithubSlugger()
const controller = require('./controllers')
const postModel = require('../../model/postes')
const userModel = require('../../model/users')
const profileModel = require('../../model/profile')
const vrefyEmailModel = require('../../model/vrefyEmail')

const sendEmail = require('../tools/sendEmail')

class panel extends controller {


    async panel(req, res, next) {
        try {
            const user = await userModel.findById(req.user.id, {}, { populate: 'profile' })

            res.render('home/panel/index', { user })
        } catch (error) {
            next(error)
        }
    }


    async vrefy(req, res, next) {
        try {
            res.render('home/panel/vrefyEmail')
        } catch (error) {
            next(error)
        }
    }

    async postVrefy(req, res, next) {
        try {
            // -
            const uniq = uniqString()
            let token = `http://localhost:3000/panel/vrefyEmail/${uniq}`

            const user = await userModel.findById(req.user.id)
            if (user.isVrefed) {
                req.flash('errors', 'شما قبلا تایید شده اید.')
                return this.back(req, res)
            }
            const newVrefy = new vrefyEmailModel({
                user: req.user.id,
                token: uniq
            })
            ///process SendEmail
            sendEmail({ username: req.user.username, token: token }).catch(err => console.log(err))

            await newVrefy.save()
            this.back(req, res)
        } catch (error) {
            next(error)
        }
    }

    async getToken(req, res, next) {
        try {
            const token = req.params.token
           
            if (!token) return res.json('Token Not Found ') //alert



            const vrefyEmail = await vrefyEmailModel.findOne({ token: token }, {}, { populate: 'user' })

            if (!vrefyEmail) return res.json('Token Not Found ')

            if (vrefyEmail.used) return res.json('This link has expired')

            if (vrefyEmail.user.isVrefyed) return this.json('شما قبلا تایید شده اید')

            vrefyEmail.user.isVrefyed = true
            vrefyEmail.used = true
            await vrefyEmail.save()
            await vrefyEmail.user.save()
            res.redirect('/panel/addpost')

        } catch (error) {
            next(error)
        }
    }

    async postPanel(req, res, next) {
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


    async pageAddpost(req, res, next) {
        try {
            const user = await userModel.findById(req.user?.id, {}, { populate: 'profile' })

            res.render('home/panel/addPost', { user })
        } catch (error) {
            next(error)
        }
    }

    async createPost(req, res, next) {
        try {


            const code = unique()
            code.substr(4)
            const post = new postModel({
                ...req.body,
                slug: slugger.slug(req.body.title),
                code: code.substr(4),
                author: req.user.id
            })
            await post.save()
            res.redirect('/panel/posts')
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new panel()
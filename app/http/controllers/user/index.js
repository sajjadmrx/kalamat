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

            res.render('home/panel/index',)
        } catch (error) {
            next(error)
        }
    }




    async updatePanel(req, res, next) {

        try {
            const result = await this.checkValidator(req)
            if (!result)
                return this.back(req, res)

            const user = await userModel.findById(req.user.id, {},)
            let { name, email, phone, website, bio, images } = req.body

            if (!images)
                delete req.body.images
            else // update avatar!
            {
                if (user.profile.avatar != 'default.png')
                    this.removePhotoOnAws({ Key: user.profile.avatar, Bucket: 'userskalamat' })
                req.body.profile = { avatar: images }
            }

            user.set({ ...req.body })

            await user.save()




            this.back(req, res)

        } catch (error) {
            next(error)
        }
    }


}

module.exports = new panel()
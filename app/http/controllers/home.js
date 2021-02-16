const controller = require('./controllers')
const postModel = require('../../model/postes')
const userModel = require('../../model/users')

const commentsModel = require('../../model/comments')
class home extends controller {

    async index(req, res, next) {
        try {

            const post = await postModel.paginate({ published: true }, {
                limit: 4,
                sort: { createAt: -1 }, populate: { path: 'author', populate: 'profile' }
            })

            res.render('home/index', { post })
        } catch (error) {
            next(error)
        }
    }


    async userProfile(req, res, next) {

        try {
            let page = req.query.page || 1
            let username = req.params.username
            if (!username.startsWith('@')) return next()
            username = username.substr(1)

            const user = await userModel.findOne({ username }, {}, {
                populate: [{ path: 'profile' }]
            })
            if (!user) return res.json(`Not Found ${username}`)///alert


            const post = await postModel.paginate({ author: user.id }, {
                limit: 5, page, populate: {
                    path: 'author', populate: 'profile'
                }
            })

            res.render('home/userProfile', { user, post })

        } catch (error) {
            next(error)
        }



    }


    async postsPage(req, res, next) {
        try {
            let query = {}
            let { search, tags } = req.query
            if (search)
                query.body = new RegExp(search, 'gi')
            if (tags)
                query.tags = new RegExp(tags, 'gi')


            const posts = await postModel.paginate({ published: true, ...query }, { limit: 8, sort: { createAt: -1 }, populate: { path: 'author', populate: 'profile' } })


            res.render('home/posts', { posts })
        } catch (error) {
            next(error)
        }
    }

    async findByCode(req, res, next) {
        try {
            let page = req.query.page || 1
            const code = req.params.code
            const post = await postModel.findOne({ code: code }, {}, { published: true, populate: 'author' })
            if (!post) return res.json('404') //404
         
            res.redirect(`/@${post.author.username}/${code}/${post.slug}`)
        } catch (error) {
            next(error)
        }
    }

    async singlePost(req, res, next) {
        try {
            let page = req.query.page || 1
            const code = req.params.code
            const username = req.params.username.substr(1)
            const slug = req.params.slug
            const post = await postModel.findOne({ code, slug }, {}, {
                published: true, populate: [{
                    path: 'author', match: {
                        username: username
                    }
                }]
            })


            if (!post || !post.author) return res.json('404') //404
            const comments = await commentsModel.paginate(
                { post: post._id, approved: true, parent: null },
                { limit: 5, page, populate: [{ path: 'childs', match: { approved: true } }] })

            const tags = post.tags[0].split(',')
            res.render('home/single-post', { post, recaptcha: this.recaptcha.render(), comments, tags })
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
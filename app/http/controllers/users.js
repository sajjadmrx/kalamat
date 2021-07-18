const unique = require('unique-slug')
const uniqString = require('unique-string')
var GithubSlugger = require('github-slugger')
var slugger = new GithubSlugger()
const controller = require('./controllers')
const profileModel = require('../../model/profile')
const vrefyEmailModel = require('../../model/vrefyEmail')
const sendEmail = require('../tools/sendEmail')
//model
const postModel = require('../../model/postes')
const userModel = require('../../model/users')
const categoriesModel = require('../../model/categories')
const commentsModel = require('../../model/comments')
class panel extends controller {


    async getAllUsers(req, res, next) {
        const page = req.query.page || 1;
        const username = new RegExp(req.query.username, 'gi') || ''
        const users = await userModel.find({ username }, 'email username name', { populate: 'profile' })

        res.json({ success: true, users })
    }


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


    async comments(req, res, next) {
        try {
            const comments = await commentsModel.paginate({ user: req.user.id },
                { populate: [{ path: 'childs' }, { path: 'user', populate: 'profile' }, { path: 'post', populate: 'author' }, { path: 'parent' }] })


            res.render('home/panel/comments/index', { comments })
        } catch (error) {
            next(error)
        }
    }




    async reply(req, res, next) {
        try {

            const result = new commentsModel({
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
            const comment = await commentsModel.findById(req.params.id, {}, { populate: { path: 'user' } });
            if (!comment) return ''//alert

            res.render('home/panel/comments/edit', { comment })

        } catch (error) {
            next(error)
        }
    }



    async updateComment(req, res, next) {
        try {
            const { approved } = req.body
            delete req.body.approved
            delete req.body.name
            await commentsModel.findByIdAndUpdate(req.params.id, {
                ...req.body,
                approved: approved == 'on' ? true : false,
            })

            res.redirect('/panel/comments')
        } catch (error) {
            next(error)
        }
    }

    async toggleApproved(req, res, next) {
        try {
            const id = req.params.id;


            const comment = await commentsModel.findById(id)
            if (!comment) return res.json('404')//404
            comment.set({ approved: !comment.approved })
            await comment.save()
            this.back(req, res)
        } catch (error) {
            next(error)
        }
    }

    async deleteComment(req, res, next) {
        const comment = await commentsModel.findById(req.params.id, {}, {
            populate: [{ path: 'childs' }]
        })
        if (!comment) return ''// alert
        comment.childs.forEach(item => item.remove());

        await comment.remove();
        this.back(req, res)
    }


    async follow(req, res, next) {
        try {

            if (!req.user) return res.send({ sucess: false, message: 'ابتدا وارد حساب کاربری خود شوید.' });
            let userTarget = await userModel.findById(req.params.userId)
            if (!userTarget) return res.send({ sucess: false, message: 'کاربر یافت نشد' })
            if (userTarget.id == req.user.id) return res.send({ sucess: false, message: 'درخواست نامعتبر' });


            const user = await userModel.findById(req.user.id, '-password')
            const isFollow = user.following.find(u => u.user == userTarget.id)

            if (isFollow)
                return res.send({ sucess: false, message: 'قبلا دنبال کرده‌اید' })

            userTarget.followers.push({ user: req.user.id })
            await user.following.push({ user: userTarget.id })
            userTarget = await userTarget.save()
            await user.save()
            res.send({ sucess: true, message: 'با موفقیت دنبال شد.', totalFollowers: userTarget.followers.length })
        } catch (error) {
            console.log(error);
        }

    }



    async unfollow(req, res, next) {
        try {

            if (!req.user) return res.send({ sucess: false, message: 'ابتدا وارد حساب کاربری خود شوید.' });
            let userTarget = await userModel.findById(req.params.userId)
            if (!userTarget) return res.send({ sucess: false, message: 'کاربر یافت نشد' })
            if (userTarget.id == req.user.id) return res.send({ sucess: false, message: 'درخواست نامعتبر' });


            const user = await userModel.findById(req.user.id, '-password')

            const isFollow = user.following.find(u => u.user == userTarget.id)

            if (isFollow == undefined)
                return res.send({ sucess: false, message: 'جزء دنبال کنندها نیست' })

            await userTarget.update({ $pull: { followers: { user: user.id } } })
            await user.update({ $pull: { following: { user: userTarget.id } } })
            userTarget = await userTarget.save()
            await user.save()

            res.send({ sucess: true, message: 'با موفقیت لغو شد.', totalFollowers: userTarget.followers.length - 1 })
        } catch (error) {
            console.log(error);
        }

    }

    async comment(req, res, next) {
        try {

            const { posts, comment, parent } = req.body;
            ///validator
            const result = await this.checkValidator(req)
            if (!result) return this.back(req, res)
            // save 


            const newcomment = new commentsModel({ post: posts, comment, user: req.user.id, parent: parent })
            newcomment.approved = true;
            newcomment.save()
            // redirect
            req.flash('errors', 'انجام شد منتظر باشید تا تایید بشه ')
            this.back(req, res)
            //alert 


        } catch (error) {
            next(error)
        }
    }


    async toggleLike(req, res, next) {
        try {

            this.id = req.params.id;
            if (!this.id)
                return res.json({ sucess: false, data: { message: 'درخواست نامعتبر' } })

            this.user = await userModel.findById(req.user.id)
            const isLiked = this.user.liked.includes(this.id)

            let response;
            if (!isLiked) {
                response = await this.toggleProcess('liked', 'add', ' شما پسندیدید');
            }
            else {
                response = await this.toggleProcess('liked', 'remove', 'شما نپسندیدید');
            }

            res.json(response)
        } catch (error) {
            next(error)
        }

    }

    async toggleBookmark(req, res, next) {
        try {
            this.id = req.params.id;
            if (!this.id)
                return res.json({ sucess: false, data: { message: 'درخواست نامعتبر' } })

            this.user = await userModel.findById(req.user.id)
            const isBookmark = this.user.bookmarks.includes(this.id)

            let response;

            if (!isBookmark) {
                response = await this.toggleProcess('bookmarks', 'add', 'با موفقیت ذخیره شد.');
            }
            else {
                response = await this.toggleProcess('bookmarks', 'remove', 'از لیست ذخیره ها حذف شد.');
            }

            res.json(response)


        } catch (error) {
            next(error)
        }

    }


    async toggleProcess(field, mehtod, message) {
        const upd = this.user[field]
        if (mehtod == 'add') {
            upd.push(this.id)
            await this.user.save();
            return { sucess: true, data: { response: true, message, number: 1 } }
        }
        else if (mehtod == 'remove') {
            upd.splice(upd.indexOf(this.id), 1)
            await this.user.save()
            return { sucess: true, data: { response: false, message, number: -1 } }
        }
    }



}

module.exports = new panel()
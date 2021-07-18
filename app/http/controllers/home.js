const controller = require('./controllers')
const postModel = require('../../model/postes')
const userModel = require('../../model/users')

const commentsModel = require('../../model/comments')
class home extends controller {

    async index(req, res, next) {
        try {

            const post = await postModel.paginate({ published: true }, {
                limit: 3,
                sort: { createdAt: -1 }, populate: { path: 'author', populate: 'profile' }
            })
            let myUser;
            if (req.user) {

                myUser = await userModel.findById({ _id: req.user.id }, {}, {})

                if (myUser.following.length) {

                    myUser = await myUser.populate({

                        path: 'following.user',
                        select: '-password -_id',
                        populate: [{
                            path: 'posts',
                            populate: [{ path: 'author', populate: 'profile', }],
                            options: { limit: 2, sort: { updatedAt: -1 } }
                        }],


                    }).execPopulate();
                }

            }
            else
                myUser = null

            res.render('home/index', { post, myUser })
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

            const user_Target = await userModel.findOne({ username }, {}, {
                populate: [{ path: 'profile' }, { path: "followrs.followers" }, { path: "followrs.following" }]
            })
            if (!user_Target) return res.json(`Not Found ${username}`)///alert 404

            const post = await postModel.paginate({ author: user_Target.id, published: true }, {
                limit: 5, page, populate: {
                    path: 'author', populate: 'profile',
                }
            })
            let isFollow;
            if (req.user) {
                isFollow = user_Target.followers.find(u => u.user == req.user.id)
                isFollow = isFollow !== undefined ? true : false
            }
            else
                isFollow = false;

            res.render('home/user/userProfile', { user_Target, post, isFollow })

        } catch (error) {
            next(error)
        }



    }


    async following(req, res, next) {


        const myInfo = await userModel.findById(req.user.id, '-password -email', {
            populate: [{ path: 'following.user' }, { path: 'profile' }]
        })


        const users = await userModel.findOne({ username: req.params.username.substr(1) }, '-password -isVrefyed -isAdmin', {
            populate: [{ path: 'following.user', select: '-password', populate: 'profile' }]
        })

        if (!users) return next(404);




        res.render('home/user/following', { users, myInfo })

    }


    async followers(req, res, next) {


        const myInfo = await userModel.findById(req.user.id, '-password -email', {
            populate: [{ path: 'following.user' }, { path: 'profile' }]
        })


        const users = await userModel.findOne({ username: req.params.username.substr(1) }, '-password -isVrefyed -isAdmin', {
            populate: [{ path: 'followers.user', select: '-password', populate: 'profile' }]
        })

        if (!users) return next(404);




        res.render('home/user/followers', { users, myInfo })

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
            const post = await postModel.findOne({ code, slug, published: true }, {}, {
                populate: [
                    { path: 'author', match: { username: username }, populate: 'profile' },
                    { path: 'savelngth' }, { path: 'likeLngth' }, { path: "categories", populate: { path: 'posts', populate: 'author' } }
                ]
            })

            if (!post || !post.author) return res.json('404') //404
            const comments = await commentsModel.paginate(
                { post: post._id, approved: true, parent: null },
                {
                    limit: 5, page, populate: [

                        { path: 'user', populate: 'profile' },

                        {
                            path: 'childs', match: { approved: true }, populate: {
                                path: 'user',
                                populate: 'profile'
                            }
                        }

                    ]

                })

            let isLiked;
            let isBookmark;
            if (req.user) {
                const myInfo = await userModel.findById(req.user.id)
                isLiked = myInfo.liked.includes(post.id)
                isBookmark = myInfo.bookmarks.includes(post.id)
            } else {
                isLiked = false;
                isBookmark = false
            }

            const tags = post.tags[0].split(',')
            res.render('home/single-post', { post, recaptcha: this.recaptcha.render(), comments, tags, isLiked, isBookmark })

        } catch (error) {
            next(error)
        }
    }



}

module.exports = new home()
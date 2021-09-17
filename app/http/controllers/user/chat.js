var GithubSlugger = require('github-slugger')
const controller = require('../controllers')

//model
const userModel = require('../../../model/users')
const chatsModel = require('../../../model/chats')
const messgesModel = require('../../../model/messages')

class chats extends controller {



    async showPage(req, res, next) {
        res.locals.layout = 'home/panel/chats'
        const user = await userModel.findById(req.user.id, {}, {
            populate: [{ path: 'posts' }]
        })

        res.render('Home/panel/chats', { title: 'چت ها', user })
    }

    async findOrCreateChat(req, res, next) {
        try {
            const targetID = req.body.user // موقت
            if (req.user.id == targetID)
                throw new Error('نمی توانید با خودتان چت کنید')


            const target = await userModel.findById(targetID)
            if (!target)
                throw new Error('کاربر یافت نشد')

            const users = [req.user.id, targetID]
            let chat = await chatsModel.findOne({
                users: {
                    $all: [
                        { $elemMatch: { $eq: req.user._id } },
                        { $elemMatch: { $eq: target._id } }
                    ]
                }
            })
            if (!chat)
                chat = await chatsModel.create({ users })

            res.status(201).json({ success: true, chat_id: chat._id })


        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, message: error.message })
        }
    }


    async getChats(req, res) {
        try {
            const chats = await chatsModel.find({ users: { $elemMatch: { $eq: req.user._id } } }, {}, {
                populate: [{ path: 'users' }, { path: 'latestMessage' }],
                sort: { updatedAt: -1 }
            })

            res.status(200).json({ success: true, chats })
        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, message: error.message })
        }
    }


    async getMessages(req, res) {
        try {
            const chat = await chatsModel.findById(req.params.id, {}, {})
            if (!chat)
                throw new Error('چت یافت نشد')

            let user = chat.users.find(us => us.toString() == req.user._id.toString())
            if (!user)
                throw new Error('شما در این چت نیستید')


            const messages = await messgesModel.find({ chat: chat._id }, {},
                {
                    sort: { createdAt: 1 },
                    populate: [
                        { path: 'sender', populate: 'profile', select: '-password -email' },
                        { path: 'latestMessage' },
                        { path: 'chat' }
                    ]
                }
            )

            res.status(200).json({ success: true, messages })
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

}

module.exports = new chats()
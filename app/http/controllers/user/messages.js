var GithubSlugger = require('github-slugger')
const controller = require('../controllers')

//model
const userModel = require('../../../model/users')
const chatsModel = require('../../../model/chats')
const profileModel = require('../../../model/profile')
const messgesModel = require('../../../model/messages')

class messages extends controller {



    async addMessage(req, res) {
        const { content, chatID } = req.body
        if (!chatID || !content)
            return res.status(400).send('فیلدها ناقض است')


        const chat = await chatsModel.findById(chatID, { }, { })
        if (!chat)
            throw new Error('چت یافت نشد')

        let user = chat.users.find(us => us.toString() == req.user._id.toString())
        if (!user)
            throw new Error('شما در این چت نیستید')

        await messgesModel.create({
            content,
            chat: chatID,
            sender: req.user._id
        }).then(async (message) => {
            message = await userModel.populate(message, { path: 'sender', populate: 'profile', select: '-password -email' })
            // message = await profileModel.populate(message, { path: 'sender.profile', select: '-password -email' })
            message = await chatsModel.populate(message, { path: 'chat' })
            chatsModel.findByIdAndUpdate(chatID, { latestMessage: message })
                .catch(error => console.log(error));

            res.status(201).send(message)

        }).catch(err => {
            res.status(400).send(err)

        })

    }

}

module.exports = new messages()
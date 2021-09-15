const mongoose = require('mongoose')
const schema = mongoose.Schema

const chatModel = new schema({
    sender: { type: schema.Types.ObjectId, ref: 'users' },
    content: { type: String, trim: true },
    chat: { type: schema.Types.ObjectId, ref: 'chat' },
}, { timestamps: true })

module.exports = mongoose.model('Message', chatModel)
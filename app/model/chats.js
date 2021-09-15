const mongoose = require('mongoose')
const schema = mongoose.Schema

const chatModel = new schema({
    users: [{ type: schema.Types.ObjectId, ref: 'users' }],
    latestMessage: { type: schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true })

module.exports = mongoose.model('chat', chatModel)
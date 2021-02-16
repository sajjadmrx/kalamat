const mongoose = require('mongoose')
const schema = mongoose.Schema

const avatar = 'https://virgool.io/images/default-avatar.jpg'
const profileModel = new schema({
    user: { type: schema.Types.ObjectId, ref: 'users' },
    images: { type: String, default: avatar },
    bio: { type: String, default: null },
    website: { type: String, default: null },
})

module.exports = mongoose.model('profile', profileModel)
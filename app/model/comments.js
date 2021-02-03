const mongoose = require('mongoose')


const mongoosePaginate = require('mongoose-paginate-v2')
const schema = mongoose.Schema


const commentsModel = new schema({
    name: { type: String },
    email: { type: String },
    parent: { type: schema.Types.ObjectId, ref: 'comments', default: null },
    news: { type: schema.Types.ObjectId, ref: 'news' },
    comment: { type: String },
    approved: { type: Boolean, default: false },
}, { toJSON: { virtuals: true } })

commentsModel.plugin(mongoosePaginate)

commentsModel.virtual('childs', {
    ref: 'comments',
    localField: '_id',
    foreignField: 'parent'
})

module.exports = mongoose.model('comments', commentsModel)
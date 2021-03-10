const mongoose = require('mongoose')


const mongoosePaginate = require('mongoose-paginate-v2')
const schema = mongoose.Schema


const commentsModel = new schema({
    user: { type: schema.Types.ObjectId, ref: 'users', default: null },
    parent: { type: schema.Types.ObjectId, ref: 'comments', default: null },
    post: { type: schema.Types.ObjectId, ref: 'posts' },
    comment: { type: String },
    approved: { type: Boolean, default: false },
}, { timestamps: true, toJSON: { virtuals: true } })

commentsModel.plugin(mongoosePaginate)

commentsModel.virtual('childs', {
    ref: 'comments',
    localField: '_id',
    foreignField: 'parent'
})

module.exports = mongoose.model('comments', commentsModel)
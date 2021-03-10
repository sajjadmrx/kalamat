const mongoose = require('mongoose')


const mongoosePaginate = require('mongoose-paginate-v2')
const schema = mongoose.Schema


const postsModel = new schema({
    title: { type: String },
    slug: { type: String },
    code: { type: String },
    miniBody: { type: String },
    body: { type: String },
    tags: { type: Array },
    images: { type: String },
    author: { type: schema.Types.ObjectId, ref: 'users' },
    categories: [{ type: schema.Types.ObjectId, ref: 'categories' }],
    commentCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    published: { type: Boolean, default: true }
}, { timestamps: true, toJSON: { virtuals: true } })

postsModel.plugin(mongoosePaginate)


postsModel.virtual('comments', {
    ref: 'comments',
    localField: '_id',
    foreignField: 'post'
})


postsModel.methods.path = function () {
    return `@${this.author.username}/${this.code}/${this.slug}`
}
postsModel.methods.shortLink = function () {
    return `localhost:3000/p/${this.code}`
}



module.exports = mongoose.model('posts', postsModel)
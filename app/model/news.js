const mongoose = require('mongoose')
const unique = require('unique-slug')

const mongoosePaginate = require('mongoose-paginate-v2')
const schema = mongoose.Schema


const newsModel = new schema({
    title: { type: String },
    slug: { type: String },
    code: { type: String },
    miniBody: { type: String },
    body: { type: String },
    tags: { type: Array },
    categories: { type: String },
    images: { type: String },
    author: { type: schema.Types.ObjectId, ref: '' },
    comments: { type: String },
    commentCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    published: { type: Boolean, default: false }
})

newsModel.plugin(mongoosePaginate)


newsModel.methods.path = function () {
    return `/newses/${this.code}/${this.slug}`
}
newsModel.methods.shortLink = function () {
    return `localhost:3000/n/${this.code}`
}



module.exports = mongoose.model('news', newsModel)
const mongoose = require('mongoose')


const mongoosePaginate = require('mongoose-paginate-v2')
const schema = mongoose.Schema


const categoriesModel = new schema({
    name: { type: String },
    slug: { type: String, unique: true },
    parent: { type: schema.Types.ObjectId, ref: 'categories', default: null },
}, { timestamps: true, toJSON: { virtuals: true } })

categoriesModel.plugin(mongoosePaginate)

categoriesModel.virtual('childs', {
    ref: 'categories',
    localField: '_id',
    foreignField: 'parent'
})

module.exports = mongoose.model('categories', categoriesModel)
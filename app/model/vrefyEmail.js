const mongoose = require('mongoose')


const mongoosePaginate = require('mongoose-paginate-v2')
const schema = mongoose.Schema


const emailVrefyModel = new schema({
    user: { type: schema.Types.ObjectId, ref: 'users' },
    used: { type: Boolean, default: false },
    token: { type: String },

}, { timestamps: true, toJSON: { virtuals: true } })

emailVrefyModel.plugin(mongoosePaginate)


module.exports = mongoose.model('emailVrefy', emailVrefyModel)
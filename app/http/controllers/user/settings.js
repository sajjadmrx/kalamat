const controller = require('../controllers');
const mongoose = require('mongoose');
class settings extends controller {

    async showPage(req, res, next) {
        try {
            const sessions = await mongoose.connection.collection('sessions')

            const sessions_ = await sessions.find({ 'session': { $regex: req.user.id } }).toArray()
            // const data = sessions_[0].session
            // res.json(sessions_)

            const data = []
            sessions_.forEach(ses => {
                data.push({ sessionID: ses._id, ...JSON.parse(ses.session) })
            })

            //res.json(data)
            res.render('home/panel/settings', { title: 'تنظیمات حساب کاربری', data })
        } catch (error) {
            next(error)
        }
    }


}
module.exports = new settings();
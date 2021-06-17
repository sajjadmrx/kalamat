const path = require('path')
const config = require('../config')
const moment = require('moment-jalaali');
const userModel = require('./model/users');
moment.loadPersian({ usePersianDigits: true })
class Helper {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.formData = req.flash('forms')[0]
    }

    getObject() {
        return {
            req: this.req,
            viewPath: this.viewPath,
            message: this.req.flash('errors'),
            old: this.old.bind(this),
            date: this.date,
            isAuth: this.isAuth()
        }
    }

    viewPath(dir) {
        return path.resolve('./resource/views' + '/' + dir);
    }
    old(value, defult = null) {
        const x = this.formData && this.formData.hasOwnProperty(value) ? this.formData[value] : defult

        return x
    }
    date(item) {
        return moment(item)
    }

    isAuth() {
        return this.req.user != undefined ? true : false
    }

}

module.exports = Helper
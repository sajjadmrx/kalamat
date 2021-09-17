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
            isAuth: this.isAuth(),
            icons: this.icons(),
            getUserAvatar: this.getUserAvatar,
            getThumbnail: this.getThumbnail
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
    icons() {
        return {
            Windows: 'https://image.flaticon.com/icons/png/512/906/906308.png',
            Android: 'https://image.flaticon.com/icons/png/512/518/518705.png',
            iOS: 'https://cdn0.iconfinder.com/data/icons/flat-round-system/512/apple-512.png',
            Linux: 'https://cdn.icon-icons.com/icons2/2235/PNG/512/linux_os_logo_icon_134670.png',
            Ubuntu: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/ubuntu_tile_logo_icon_170354.png',
            default: 'https://st3.depositphotos.com/10638838/14264/v/450/depositphotos_142648873-stock-illustration-computer-pc-monitor-web-logo.jpg'
        }
    }
    getUserAvatar(key) {
        if (key.startsWith('https')) return key
        return `https://userskalamat.s3.ir-thr-at1.arvanstorage.com/${key}`
    }
    getThumbnail(key) {
        return `https://postskalamat.s3.ir-thr-at1.arvanstorage.com/${key}`

    }

}

module.exports = Helper
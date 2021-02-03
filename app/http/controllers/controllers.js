const autoBind = require('auto-bind')
const fs = require('fs')
const path = require('path')
const { validationResult } = require('express-validator')
const Recaptcha = require('express-recaptcha').RecaptchaV2

const config = require('../../../config')
module.exports = class controllers {
    constructor() {
        autoBind(this)
        this.configRecaptcha()
    }


    async checkValidator(req) {
        const validator = await validationResult(req)
        const err = validator.array();

        const message = []
        err.map(item => message.push(item.msg))

        if (message.length == 0)
            return true

        if (req.body.images)
            fs.unlinkSync(path.resolve(`./public/${req.body.images}`))

        req.flash('errors', message)
        req.flash('forms', req.body)
        return false

    }

    configRecaptcha() {
        let service = config.service.recaptcha
        this.recaptcha = new Recaptcha(service.clinet_key, service.secret_key, { ...service.options })

        return this.recaptcha
    }


    recaptchaValidator(req, res) {
        return new Promise((resolve, rejects) => {
            this.recaptcha.verify(req, (err, data) => {
                if (err) {
                    req.flash('errors', 'روی من ربات نیستم کلیک کنید.')
                    this.back(req, res)
                }
                else
                    resolve(true)
            })
        })
    }

    back(req, res) {
        res.redirect(req.header('Referer') || '/')
    }



}

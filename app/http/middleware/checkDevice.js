const middleware = require('./middleware');
const utils = require('../../utils')

class checkDevice extends middleware {
    async handel(req, res, next) {
        try {
            const device = utils.getInfoRequest(req)
            const ip = await utils.getIpInfo(req)
            device.ip = ip
            req.session.device = device
            req.session.loginAt = Date.now();
            await req.session.save()
            next()
        } catch (error) {
            console.log(error)
            next()
        }
    }
}

module.exports = new checkDevice()
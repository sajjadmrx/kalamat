const parser = require('ua-parser-js')
const iplocate = require('node-iplocate')
class utils {

    getInfoRequest(req) {
        return parser(req.headers['user-agent']);
    }
    async getIpInfo(req) {
        try {
            return await iplocate(req.ip)
        } catch (error) {
            return {}
        }
    }

}
module.exports = new utils();;

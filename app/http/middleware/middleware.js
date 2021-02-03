const autoBind = require('auto-bind');


module.exports = class middleware {
    constructor() {
        autoBind(this)
    }
}
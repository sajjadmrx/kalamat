const autoBind = require('auto-bind');

module.exports = class validations {
    constructor() {
        autoBind(this)
    }
}


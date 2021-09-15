const autoBind = require('auto-bind');


class Socket {

    constructor() {
        autoBind(this);
    }

}
module.exports = Socket
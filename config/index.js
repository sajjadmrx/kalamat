const database = require('./dataBase')
const layout = require('./layout')
const session = require('./session')
const service = require('./service')
module.exports = {
    database,
    layout,
    session,
    service,
    debug: true
}
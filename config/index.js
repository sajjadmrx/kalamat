const database = require('./dataBase')
const layout = require('./layout')
const session = require('./session')
const service = require('./service')
const aws = require('./aws')
module.exports = {
    database,
    layout,
    session,
    service,
    awS: aws,
    debug: true
}
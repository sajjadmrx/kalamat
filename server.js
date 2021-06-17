require('dotenv').config()
const app = require('./app')
const config = require('./config')

new app()
global.config = config
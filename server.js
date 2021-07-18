require('dotenv').config()
const app = require('./app')
const config = require('./config')
global.config = config

new app()
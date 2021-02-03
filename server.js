const app = require('./app')
const config = require('./config')
require('dotenv').config()

new app()
global.config = config
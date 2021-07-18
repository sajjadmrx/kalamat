require('dotenv').config()
const app = require('./app')
const config = require('./config')
require('https').globalAgent.options.rejectUnauthorized = true;
global.config = config

new app()
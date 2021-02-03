const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
module.exports = {
    secret: 'mySecret',
    resave: true,
    saveUninitialized: true,
    cookie: { expires: new Date(Date.now() + 1000 * 60 * 60 * 6) },
    store: new MongoStore({ mongooseConnection: mongoose.connection })

}
const passport = require('passport')
const bcrypt = require('bcrypt')
const passportLocal = require('passport-local')

//Model
const userModel = require('../model/users')
const profModel = require('../model/profile')

passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    userModel.findById(id, function (err, user) {
        done(err, user)
    })
})


passport.use('local.register', new passportLocal(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        let user;

        user = await userModel.findOne({ email })
        if (user)
            return done(null, false, { message: 'ایمیل تکراری میباشد.' })

        user = await userModel.findOne({ username: req.body.username })
        if (user)
            return done(null, false, { message: 'نام کاربری تکراری میباشد.' })

        delete req.body.password

        const salt = await bcrypt.genSalt(10)
        const passHashid = await bcrypt.hash(password, salt)
        req.body.password = passHashid
        user = new userModel({
            ...req.body
        })
        const newprof = new profModel({
            user: user.id
        })
        await newprof.save()
        await user.save()
        return done(null, user)
    }
))


passport.use('local.login', new passportLocal(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        const user = await userModel.findOne({ email: email })

        if (!user) return done(null, false, req.flash('errors', 'اطلاعات مطابقت نـدارد.'))
        const resHash = await bcrypt.compare(password, user.password)
        if (!resHash) return done(null, false, req.flash('errors', 'اطلاعات مطابقت نـدارد.'))
        return done(null, user)
    }
))
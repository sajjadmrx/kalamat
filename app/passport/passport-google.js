const passport = require('passport')
const bcrypt = require('bcrypt')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
var GithubSlugger = require('github-slugger')
var slugger = new GithubSlugger()
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


passport.use(new GoogleStrategy({
    clientID: process.env.Google_client_key,
    clientSecret: process.env.GOOGLE_SECRET_KEY,
    callbackURL: 'http://localhost:3000/callback/google',
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, cb) => {

    try {
        let user = await userModel.findOne({ email: profile.emails[0].value })
        if (user) {
            delete user.password
            return cb(null, user);
        }

        const salt = bcrypt.genSaltSync(10)
        user = await new userModel({
            email: profile.emails[0].value,
            name: profile.displayName,
            username: profile.emails[0].value.split('@')[0],
            provider: 'google',
            providerId: profile.id,
            role: 'user',
            isVrefyed: profile.emails[0].verified ? true : false,
            password: bcrypt.hashSync(profile.emails[0].value, salt),

        }).save()
        await new profModel({ user: user.id, images: profile.photos[0]?.value }).save()

        delete user.password
        cb(null, user)
    } catch (error) {
        console.log(error)
        cb(error)
    }
}))


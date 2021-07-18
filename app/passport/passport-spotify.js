const passport = require('passport')
const bcrypt = require('bcrypt')
const SpotifyStrategy = require('passport-spotify').Strategy;

const spotify = require('passport-spotify')


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


passport.use(new SpotifyStrategy({
    clientID: process.env.spotify_client_key,
    clientSecret: process.env.spotify_SECRET_KEY,
    callbackURL: 'http://localhost:3000/callback/spotify',
    scope: ['user-read-email', 'user-read-private'],

    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, cb) => {

    //   cb(null, null, profile)

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
            provider: profile.provider,
            providerId: profile.id,
            role: 'user',
            isVrefyed: false,
            password: bcrypt.hashSync(profile.id, salt),

        }).save()
        await new profModel({ user: user.id, images: profile.photos[0]?.value }).save()

        delete user.password
        cb(null, user)
    } catch (error) {
        console.log(error)
        cb(error)
    }
}))


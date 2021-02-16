const controller = require('../controllers')
const passport = require('passport')
class auth extends controller {

    async pageLogin(req, res, next) {
        try {

            res.render('home/auth/login', { recaptcha: this.recaptcha.render() })

        } catch (error) {
            next(error)
        }
    }

    async Login(req, res, next) {
        try {



            passport.authenticate('local.login', (err, user) => {
                if (!user)
                    return this.back(req, res)

                req.logIn(user, err => {
                    return res.redirect('/')
                })


            })(req, res, next)

        } catch (error) {
            next(error)
        }
    }


    async pageRegister(req, res, next) {
        try {
            res.render('home/auth/register', { recaptcha: this.recaptcha.render() })

            //vaidator
            //check user
            // save user
        } catch (error) {

        }
    }


    async register(req, res, next) {
        try {
            await this.recaptchaValidator(req, res)
            const resultValidator = await this.checkValidator(req)
            if (!resultValidator) return this.back(req, res)
            passport.authenticate('local.register', {
                successRedirect: '/',
                failureRedirect: '/auth/register',
                failureFlash: true
            })(req, res, next)

        } catch (error) {
            console.log(error);
        }
    }


}

module.exports = new auth()
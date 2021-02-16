const validators = require('./validators')
const userModel = require('../../model/users')
const { check } = require('express-validator/check')
class validatorRegister extends validators {

    handel() {
        return [
            check('username').isLength({ min: 5 })
                .withMessage('نام کاربری نباید کمتر از 5 کاراکتر باشد.'),

            check('username').custom(async (value) => {
                const user = await userModel.findOne({ username: value })
                if (user) {
                    return req.flash('errors', 'نام کاربری تکراری میباشد')
                }
            }),
            check('email')
                .isEmail()
                .withMessage('یک ایمیل معتبر وارد کنید'),
            check('email')
                .custom(async (value, { req }) => {
                    const email = await userModel.findOne({ email: value })
                    if (email) {
                        return req.flash('errors', 'ایمیل تکراری میباشد')
                    }
                }),
            check('name').isLength({ min: 5 })
                .withMessage('نام نباید کمتر از 5 کاراکتر باشد.'),
        ]
    }

}

module.exports = new validatorRegister();
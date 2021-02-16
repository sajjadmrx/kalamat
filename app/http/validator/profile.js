const validators = require('./validators')
const path = require('path')
const { check } = require('express-validator/check')
class validatorProfile extends validators {

    handel() {
        return [
            check('name').isLength({ min: 5 })
                .withMessage('نام نباید کمتر از 5 کاراکتر باشد.'),
            check('email')
                .isEmail()
                .withMessage('یک ایمیل معتبر وارد کنید'),
            check('images')
                .custom(async (value, { req }) => {
                    if (!value)
                        return
                    const extFile = ['.png', '.jpg', '.jpeg', '.svg', '.PNG', '.JPG', '.gif']
                    if (!extFile.includes(path.extname(value)))
                        throw new Error('فرمت عکس مجاز نیست.')
                }),
        ]
    }

}

module.exports = new validatorProfile();
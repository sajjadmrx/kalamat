const validators = require('./validators')

const { check } = require('express-validator/check')
class validatorCommentNews extends validators {

    handel() {
        return [
            check('name').notEmpty()
                .withMessage('فیـلد نام نباید خالی باشد.'),
            check('email').isEmail()
                .withMessage('ایمیل وارده شده معتبر نیست.'),
            check('comment').notEmpty()
                .withMessage('فیلد کامنت نباید خالی باشد.'),
        ]
    }

}

module.exports = new validatorCommentNews();
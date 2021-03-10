const validators = require('./validators')

const { check } = require('express-validator/check')
class validatorCommentNews extends validators {

    handel() {
        return [

            check('comment').notEmpty()
                .withMessage('فیلد کامنت نباید خالی باشد.'),
        ]
    }

}

module.exports = new validatorCommentNews();
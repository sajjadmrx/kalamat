const validators = require('./validators')
const path = require('path')
const { check } = require('express-validator/check')
class validatorCreateNews extends validators {

    handel() {
        return [
            check('title').isLength({ min: 5 })
                .withMessage('موضوع نباید کمتر از 5 کاراکتر باشد.'),
            check('miniBody').isLength({ min: 5, max: 112 })
                .withMessage('توضیح کوتا  نباید کمتر از 5  و بیشتر از 112 کاراکتر باشد.'),
            check('body').isLength({ min: 5 })
                .withMessage('مقاله نباید کمتر از 5 کاراکتر باشد.'),
            check('tags').notEmpty()
                .withMessage('تگ نباید خالی باشد.'),
            check('thumbnail')
                .custom(async (value, { req }) => {

                    if (req.query._method == 'put' && value == undefined) return;
                    if (!value)
                        throw new Error('وارد کردن یک تصویر الزامیست.');
                    const extFile = ['.png', '.jpg', '.jpeg', '.svg', '.PNG', '.JPG']
                    if (!extFile.includes(path.extname(value)))
                        throw new Error('فرمت عکس مجاز نیست.')
                    req.body.thumbnail = value
                }),
        ]
    }

}

module.exports = new validatorCreateNews();
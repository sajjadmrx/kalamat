
const userModel = require('../../../model/users')

class follow {

    async follow(req, res, next) {
        try {

            if (!req.user) return res.send({ sucess: false, message: 'ابتدا وارد حساب کاربری خود شوید.' });
            let userTarget = await userModel.findById(req.params.userId)
            if (!userTarget) return res.send({ sucess: false, message: 'کاربر یافت نشد' })
            if (userTarget.id == req.user.id) return res.send({ sucess: false, message: 'درخواست نامعتبر' });


            const user = await userModel.findById(req.user.id, '-password')
            const isFollow = user.following.find(u => u.user == userTarget.id)

            if (isFollow)
                return res.send({ sucess: false, message: 'قبلا دنبال کرده‌اید' })

            userTarget.followers.push({ user: req.user.id })
            await user.following.push({ user: userTarget.id })
            userTarget = await userTarget.save()
            await user.save()
            res.send({ sucess: true, message: 'با موفقیت دنبال شد.', totalFollowers: userTarget.followers.length })
        } catch (error) {
            console.log(error);
        }

    }



    async unfollow(req, res, next) {
        try {

            if (!req.user) return res.send({ sucess: false, message: 'ابتدا وارد حساب کاربری خود شوید.' });
            let userTarget = await userModel.findById(req.params.userId)
            if (!userTarget) return res.send({ sucess: false, message: 'کاربر یافت نشد' })
            if (userTarget.id == req.user.id) return res.send({ sucess: false, message: 'درخواست نامعتبر' });


            const user = await userModel.findById(req.user.id, '-password')

            const isFollow = user.following.find(u => u.user == userTarget.id)

            if (isFollow == undefined)
                return res.send({ sucess: false, message: 'جزء دنبال کنندها نیست' })

            await userTarget.update({ $pull: { followers: { user: user.id } } })
            await user.update({ $pull: { following: { user: userTarget.id } } })
            userTarget = await userTarget.save()
            await user.save()

            res.send({ sucess: true, message: 'با موفقیت لغو شد.', totalFollowers: userTarget.followers.length - 1 })
        } catch (error) {
            console.log(error);
        }

    }

}
module.exports = new follow()
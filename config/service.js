

module.exports = {

    recaptcha: {
        clinet_key: process.env.RECAPTCHA_KEY,
        secret_key: process.env.RECAPTCHA_SECRET,
        options: { 'hl': 'fa' }
    },
    google: {
        clinet_key: process.env.Google_client_key,
        secret_key: process.env.GOOGLE_SECRET_KEY,
        callback_url: 'http://localhost:3000/callback/google'
    },
    mail: {
        user: process.env.mailUser,
        pass: process.env.mailPass,
    },
    sms: process.env.SMS_KEY,
}
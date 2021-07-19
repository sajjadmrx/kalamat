
const nodemailer = require("nodemailer");


function main() {

    //  https://mailtrap.io
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: config.service.mail.user,
            pass: config.service.mail.pass,
        }
    });

    return transport




}

module.exports = main
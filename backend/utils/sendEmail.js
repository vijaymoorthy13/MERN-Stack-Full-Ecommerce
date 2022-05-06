const nodeMailer = require("nodemailer");


const sendEmail = async (options) => {

    const transporter = nodeMailer.createTransport({
        host:"smtp.gmail.com",
        port:587,        
        service: "gmail",
        auth:{
            user: "vijay.moorthy97@gmail.com",
            pass: "nokialumia5", 
        },
    });

    const mailOptions = {
        from:process.env.SMTP_MAIL,
        to:options.email,   // email and subject and message  in user controller
        subject:options.subject,
        text:options.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail; 
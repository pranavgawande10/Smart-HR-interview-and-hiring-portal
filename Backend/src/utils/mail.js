import mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (Option)=>{
    const mailGenerator = new mailgen({
        theme: "default",
        product: {
            name: "Job Portal",
            link: "https://job-portal.com/"
        }
    })
    
    const emailTextual = mailGenerator.generatePlaintext(Option.mailgenContent);
    
    const emailHtml = mailGenerator.generate(Option.mailgenContent);
    
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    })
    
    const mail = {
        from : "jobportal@example.com",
        to : Option.email,
        subject : Option.subject,
        text : emailTextual,
        html : emailHtml
    }
    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.log("Email sending error:", error);
        throw new Error("Failed to send email");
    }
    
}

const emailVerificationMailgenContent = (username , verificationUrl)=>{
    return {
        body:{
            name : username,
            intro : "Welcome to Job Portal! We're very excited to have you on board.",
            action : {
                instruction : "To verify your email please click on the button below:",
                button : {
                    color : "#22BC66",  
                    text : "Verify your email",
                    link : verificationUrl
                }
            },
            outro : "If you did not create an account, no further action is required."
            
        }
    }
}

const passwordResetMailgenContent = (username , passwordResetUrl)=>{
    return {
        body:{
            name : username,
            intro : "You have requested to reset your password.",
            action : {
                instruction : "To reset your password please click on the button below:",
                button : {
                    color : "#DC4D2F",      
                    text : "Reset your password",
                    link : passwordResetUrl
                }
            },
            outro : "If you did not request a password reset, no further action is required."
        }
    }
}

export {sendEmail, emailVerificationMailgenContent, passwordResetMailgenContent};
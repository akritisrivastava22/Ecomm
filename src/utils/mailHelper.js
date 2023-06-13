import config from "../config/index";
import transporter from "../config/transporter";

const mailHelper = async (option) => {
    const message = {
        from: config.SMTP_SENDER_EMAIL,
        to: option.email,
        subjec: option.subject,
        text: option.message
    }
    await transporter.sendMail(message)
}

export default mailHelper

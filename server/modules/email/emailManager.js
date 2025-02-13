// Module to manage email SMTP provider(s) using nodeMailer
const nodeMailer = require("nodemailer");

class EmailManager {
  constructor(provider) {
    provider = provider.toLowerCase();
    if (provider === "brevo") {
      this.transporter = nodeMailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
          user: process.env.BREVO_USER,

          pass: process.env.BREVO_SMTP_KEY,
        },
        secure: false,
        logger: true,  // Log SMTP connection details
        debug: true,   // Debug mode
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 5000,    // 5 seconds
        socketTimeout: 10000      // 10 seconds
      
      });
    }
    
  }

  async sendEmail({ from, to, subject, text,html }) {
    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        text,
        html
      });
      console.log("Email sent");
      return info;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = EmailManager;

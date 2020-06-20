const request = require("request");
const { body } = require("express-validator");

const sendRegister = (link, to, subject, html) => {
  let obj = {
    heading: "Admin SMVT e-commerce",
    subject: "Activate registered account from SMVT e-commerce",
    html: `You have registerd an account from SMVT e-commerce. In order to login, you need to activate your account <a href="${link}">Here</a>`,
  };
  let htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <body>
    <h1>${obj.heading}</h1>
    <h2>Activate registered account from SMVT e-commerce</h2>    
    <h3>${obj.html}</h3>
    </body>
    </html>
  `;
    request({
      method: "post",
     url: "https://api.sendgrid.com/v3/mail/send",
      headers: {
        Authorization:
          `Bearer ${process.env.SENDGRID_API_KEY}`
      },
    data: {
      personalizations: [
        {
          to: [
            {
              email: `${to}`,
              name: `${to}`
            },           
          ],
          subject: `${obj.subject}`
        }
      ],
      from: {
        email: "mthang1801@gmail.com",
        name: "MVT"
      },
      content: [{ type: "text/html", value: htmlTemplate }]
    }
};

const activeRegister = {};

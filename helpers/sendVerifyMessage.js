const fs = require("fs/promises");
require("dotenv").config();
const handlebars = require("handlebars");
const { sendEmail } = require(".");

const { BASE_URL, DB_SERVER_PORT = 8080 } = process.env;

const sendVerifyMessage = async (email, verificationToken) => {
  const templatePath = "./templates/emailTemplate.hbs";

  const templateContent = await fs.readFile(templatePath, "utf-8");
  const emailTemplate = handlebars.compile(templateContent);

  const emailData = {
    url: `${BASE_URL}:${DB_SERVER_PORT}/api/users/verify/${verificationToken}`,
  };

  const htmlContent = emailTemplate(emailData);

  const verifyEmail = {
    to: email,
    subject: "Verify your email",
    html: htmlContent,
  };

  await sendEmail(verifyEmail);
};

module.exports = sendVerifyMessage;

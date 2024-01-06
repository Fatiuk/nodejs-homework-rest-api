const sendGridMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY } = process.env;

sendGridMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const emailMessage = { ...data, from: "andrii.fatiuk@meta.ua" };
  await sendGridMail
    .send(emailMessage)
    .then(() => {
      console.log("Email send success");
    })
    .catch((error) => {
      console.log(error.message);
    });
};

module.exports = sendEmail;

let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "89add3e6eb2dae",
    pass: "c509b6db43aa32"
  }
});

exports.sendEmail = async (req, res) => {
  console.log(req.body);
  let info = await transporter.sendMail({
    from: req.body.sender,
    to: "dani@dgfitness.com",
    subject: req.body.subject,
    text: req.body.text,
  });
  console.log("Message sent: %s", info.messageId);

  res.send({ message: "Email was sent successfully." });
}


let nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
const uri =
  "mongodb+srv://dani99:ChichoMitko@cluster0.2zjugut.mongodb.net/?retryWrites=true&w=majority";
const mongodb = require("mongodb");
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true });

async function makeConnection() {
  try {
    await client.connect();
  } catch (error) {
    console.error(error);
  }
}
let transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "409a6350c95676",
    pass: "5e46021b33a63d"
  }
});

exports.sendEmail = async (req, res) => {
  let info = await transporter.sendMail({
    from: req.body.sender,
    to: "dani@dgfitness.com",
    subject: req.body.subject,
    text: req.body.text,
  });
  console.log("Message sent: %s", info.messageId);

  res.send({ message: "Email was sent successfully." });
}

exports.login = async (req, res) => {
  console.log(req.body);
  await makeConnection();
  let user = await client
    .db("fitness")
    .collection("users")
    .findOne({ email: req.body.email })
  if (user) {
    let isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordValid) {
      res.status(401).send({
        error: "Invalid password!",
      });
    } else {

      res.status(200).json({
        email: req.body.email,
        message: "Login successfully!",
      });
    }
  } else {
    res.status(401).send({ error: "User not found!" });
  }
}

exports.signUp = async (req, res) => {

  await makeConnection();
  let user = await client.db("fitness").collection("users").insertOne({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  if (user) {
    res
      .status(200)
      .send({
        email: req.body.email,
        message: "Signed up successfully!",
      });
  } else {
    res.send({ error: "There was an issue when registering." });
  }
}

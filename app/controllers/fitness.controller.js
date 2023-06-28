let nodemailer = require("nodemailer");
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
    pass: "5e46021b33a63d",
  },
});

exports.sendEmail = async (req, res) => {
  let info = await transporter.sendMail({
    from: req.body.sender,
    to: "dani@dgfitness.com",
    subject: req.body.subject,
    text: req.body.text,
  });
  console.log("Message sent: %s", info.messageId);

  res.send({ message: "Имейлът е изпратен успешно." });
};

exports.login = async (req, res) => {
  await makeConnection();
  let user = await client
    .db("fitness")
    .collection("users")
    .findOne({ email: req.body.email });
  if (user) {
    let isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordValid) {
      res.status(401).send({
        error: "Грешна парола!",
      });
    } else {
      res.status(200).json({
        user: user,
        message: "Успешен вход!",
      });
    }
  } else {
    res.status(401).send({ error: "Не е намерен такъв потребител!" });
  }
};

exports.addNewProgram = async (req, res) => {
  await makeConnection();

  const result = await client
    .db("fitness")
    .collection("users")
    .updateOne(
      { email: req.body.email },
      {
        $set: {
          diets: {
            dietGymDayDinner: req.body.dietGymDayDinner,
            dietGymDayFirstSnack: req.body.dietGymDayFirstSnack,
            dietGymDayLunch: req.body.dietGymDayLunch,
            dietGymDayBreakfast: req.body.dietGymDayBreakfast,
            dietGymDaySecondSnack: req.body.dietGymDaySecondSnack,
            dietRestDayBreakfast: req.body.dietRestDayBreakfast,
            dietRestDayDinner: req.body.dietRestDayDinner,
            dietRestDayFirstSnack: req.body.dietRestDayFirstSnack,
            dietRestDayLunch: req.body.dietRestDayLunch,
            dietRestDaySecondSnack: req.body.dietRestDaySecondSnack,
          },
          program: {
            monday: req.body.monday,
            tuesday: req.body.tuesday,
            wednesday: req.body.wednesday,
            thursday: req.body.thursday,
            friday: req.body.friday,
            saturday: req.body.saturday,
            sunday: req.body.sunday,
          },
        },
      }
    );

  const deletionResult = await client
    .db("fitness")
    .collection("programRequests")
    .deleteOne({ email: req.body.email });

  if (result.matchedCount && deletionResult.deletedCount) {
    res.status(200).send({
      message: "Програмата е изтрита успешно!",
    });
  } else {
    res.send({ error: "Грешка по време на изтриване на програмата!" });
  }
};

exports.createRequest = async (req, res) => {
  await makeConnection();
  const userData = await client
    .db("fitness")
    .collection("users")
    .findOne({ email: req.body.email });

  const result = await client
    .db("fitness")
    .collection("users")
    .updateOne(
      { email: req.body.email },
      {
        $set: {
          hasSentRequest: true,
        },
      }
    );
  const request = await client
    .db("fitness")
    .collection("programRequests")
    .insertOne({
      email: req.body.email,
      weight: req.body.weight,
      height: req.body.height,
      comment: req.body.comment,
      activityLevel: req.body.activityLevel,
      goal: req.body.goal,
      gender: userData.gender,
      date: Date.now(),
      names: `${userData.firstName} ${userData.lastName}`,
    });

  if (request && result.matchedCount) {
    res.status(200).send({
      message: "Успешно изпратена заявка!",
    });
  } else {
    res.send({ error: "Грешка при изпращането на заявката!" });
  }
};

exports.getUserData = async (req, res) => {
  await makeConnection();
  const userData = await client
    .db("fitness")
    .collection("users")
    .findOne({ email: req.body.currentUserEmail });

  if (userData) {
    res.send({
      id: userData._id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      diets: userData.diets,
      program: userData.program,
      profileImage: userData?.profileImage,
      gender: userData.gender,
      isAdmin: userData?.isAdmin,
      hasSentRequest: userData?.hasSentRequest,
    });
  }
};

exports.getRequestData = async (req, res) => {
  await makeConnection();
  const requestData = await client
    .db("fitness")
    .collection("programRequests")
    .findOne({ _id: new mongodb.ObjectID(req.params.id) });

  res.send(requestData);
};

exports.getProgramRequests = async (req, res) => {
  await makeConnection();
  const programRequests = await client
    .db("fitness")
    .collection("programRequests")
    .find()
    .toArray();
  res.send(programRequests);
};
exports.signUp = async (req, res) => {
  await makeConnection();

  let user = await client
    .db("fitness")
    .collection("users")
    .insertOne({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      profileImage: req.body.profileImage,
    });

  if (user) {
    res.status(200).send({
      user: user,
      message: "Успешна регистрация!",
    });
  } else {
    res.send({ error: "Грешка по време на регистрацията!" });
  }
};

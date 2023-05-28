const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();

let corsOptions = {
  origin: "http://localhost:8082"
};

app.use(cors(corsOptions));


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Dani's fitness application." });
});

require("./app/routes/fitness.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

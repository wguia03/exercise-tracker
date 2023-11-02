require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Other Stuff
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error");
  });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// Schemas and Models
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

const userModel = mongoose.model("userModel", userSchema);

// Endpoints
app.post("/api/users", (req, res) => {
  const { username } = req.body;
  const newUser = new userModel({ username: username });
  newUser
    .save()
    .then((doc) => {
      res.json({ username: doc.username, _id: doc._id });
    })
    .catch((err) => {
      res.json({ error: "Database connection error" });
    });
});

app.get("/api/users", (req, res) => {
  userModel
    .find()
    .select({ __v: 0 })
    .then((list) => {
      res.send(list);
    })
    .catch((err) => {
      res.json({ error: "Database connection error" });
    });
});

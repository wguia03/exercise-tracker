require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

// Date Validator
function isValidDate(dateString) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(dateString);
}

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// Schemas and Models
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

const userModel = mongoose.model("user", userSchema);

const exerciseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: Date,
});

const exerciseModel = mongoose.model("exercise", exerciseSchema);

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

app.post("/api/users/:_id/exercises", (req, res) => {
  let { description, duration, date } = req.body;
  let userId = req.params._id;
  if (!date) {
    date = new Date();
  } else {
    date = new Date(date);
  }

  const newExercise = new exerciseModel({
    userId: userId,
    description: description,
    duration: duration,
    date: date,
  });
  newExercise
    .save()
    .then((doc) => {
      userModel
        .findOne({ _id: userId })
        .select({ __v: 0 })
        .then((data) => {
          res.json({
            username: data.username,
            description: doc.description,
            duration: doc.duration,
            date: doc.date.toDateString(),
            _id: data._id,
          });
        })
        .catch((err) => {
          res.json({ error: "Database connection error" });
        });
    })
    .catch((err) => {
      res.json({ error: "Database connection error" });
    });
});

app.get("/api/users/:_id/logs", (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  userModel
    .findById(_id)
    .then((userData) => {
      const username = userData.username;

      let query = { userId: _id };
      if (from && to && isValidDate(from) && isValidDate(to)) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        query.date = {
          $gte: fromDate,
          $lte: toDate,
        };
      }

      exerciseModel
        .find(query)
        .select({ _id: 0, userId: 0, __v: 0 })
        .limit(limit)
        .then((data) => {
          const newData = data.map((object) => {
            return {
              description: object.description,
              duration: object.duration,
              date: object.date.toDateString(),
            };
          });

          res.json({
            username: username,
            count: newData.length,
            log: newData,
          });
        })
        .catch((err) => {
          res.json({ error: "Database connection error" });
        });
    })
    .catch((err) => {
      res.json({ error: "Database connection error" });
    });
});

//Listener
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

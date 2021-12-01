const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// var cron = require("node-cron");
const errorHandler = require("./../api/middleware/error.middleware");

// const { adjustNewTutor } = require("./../api/cron-jobs");

const authRoutes = require("./../api/routes/auth");
const animalRoutes = require("./../api/routes/animal");
const medicalRoutes = require("./../api/routes/health");
const feedRoutes = require("./../api/routes/feed");
const userRoutes = require("./../api/routes/user");
const subscribeRoutes = require("./../api/routes/subscribe");

module.exports = function (app) {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use("/uploads", express.static(path.join(__dirname, "./../public/uploads")));


  /* Logging every request  */
  app.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
  });

  /* For Cors Issue */

  const allowedOrigins = [
    "http://localhost:3001",
    "http://localhost:3000",
    "https://cattlecare.herokuapp.com"
  ];

  app.use(
    cors({
      credentials: true,
      origin: function (origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg =
            "The CORS policy for this site does not " +
            "allow access from the specified Origin.";
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
    })
  );

  app.use(express.json());
  app.get("/", (req, res) => res.send("Hello World!"));
  app.get("/api", (req, res) => res.send("Hello API World!"));

  // app.post('/api/test', (req, res) => {
  //   console.log('post test webHook', req.body);
  //   res.status(200).send('test webHook');
  // });
  // app.get('/api/test', (req, res) => {
  //   console.log('get test webHook', req.body);
  //   res.status(200).send('test webHook');
  // });

  app.use("/api/auth", authRoutes);
  app.use("/api/animal", animalRoutes);
  app.use("/api/medical", medicalRoutes);
  app.use("/api/feed", feedRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/stripe", subscribeRoutes);
  app.use(errorHandler.errorMiddleware);

  // cron.schedule("* * * * *", adjustNewTutor);
};

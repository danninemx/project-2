require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var http = require("http")
require('./dayly-email/email-sender.js')


// For Account Manager
const cookieparser = require('cookie-parser');
const xsession = require('express-session');
const passport = require('passport');
const MySQLStore = require('express-mysql-session')(xsession);


var db = require("./models");
var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieparser());
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());


//CREDENTIALS FOR STORING THE SESSION IN THE DATABASE
var options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

// STORE THE SESSION IN THE DATABASE
var sessionStore = new MySQLStore(options);
app.use(xsession({
  secret: 'jsjdsjndsndsjdnsjdnsdjsw',
  resave: false,
  store: sessionStore,
  saveUninitialized: false
  // cookie: { secure: true }
}))


// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require('./config/passport')(app);
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// // Scheduled Heroku server waker: Enable this if this service needs to be online all the time
// setInterval(function (err) {
//   http.get("http://immense-ridge-78589.herokuapp.com/");
// }, 300000);


// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});


module.exports = app;

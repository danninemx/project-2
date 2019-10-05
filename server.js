require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");

var http = require("http"); // For scheduled Heroku server waker

// Passport setup
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



var options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,


};
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

// Scheduled Heroku server waker
setInterval(function () {
  http.get("https://immense-ridge-78589.herokuapp.com/");
}, 1200000);


//------------//
// Nodemailer //
//------------//
'use strict';
const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
async function main() {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'projectgroupLynx@gmail.com',
      pass: 'project-2'
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Group Lynx 👻" <projectgroupLynx@gmail.com>', // sender address
    to: 'dudkny@gmail.com, projectgrouplynx@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>' // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

// Daily mass transmission task.
let massSend = function () {
  main().catch(console.error);
}

//--------------------------------------------------------------------//
// TO-DO: ADD A ONE-TIME EMAIL TEMPLATE TO BE SENT UPON USER SIGN-UP. //
//--------------------------------------------------------------------//

//----------------//
// Task Scheduler //
//----------------//
const cron = require('node-cron');

// Schedule the daily mass transmission task.
const daily = cron.schedule('0 7 * * *', () => {
  console.log('Running daily job at 07:00');
  massSend();
}, {
    scheduled: true
  });

// On load, Node-cron starts the mass transmission schedule.
daily.start();

//----------------------------------------------------------------------//
// TO-DO: ADD A ONE-TIME TRANSMISSION TASK TO BE RUN UPON USER SIGN-UP. //
//----------------------------------------------------------------------//



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

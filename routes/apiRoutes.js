var db = require("../models");
var express = require("express");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var xvalidator = require('express-validator');
var bcrypt = require('bcryptjs');
var saltRounds = 10;
var apiKey = 'basic 57450f850d36078973ddccd15d1db72b-us20';
var request = require("request");
const nodemailer = require('nodemailer');

const Sequelize = require("sequelize");
const Op = Sequelize.Op; // Sequelize querying operator


module.exports = function (app) {

  //API for all data in table guide
  app.get('/api/js/guide', (req, res) => {
    db.guide.findAll({}).then((result) => {
      res.json(result)
    })
  })

  //API for all data in table cssData
  app.get('/api/css/properties', (req, res) => {
    db.cssData.findAll({}).then((result) => {
      res.json(result)
    })
  })

  //API for single result in table cssData
  app.get('/api/css/properties/:name', (req, res) => {
    db.cssData.findAll({ where: { properties: req.params.name } }).then((result) => {
      res.json(result)
    })
  })


  //API for all data in table jsMethodsData
  app.get('/api/js/methods', (req, res) => {
    db.jsMethodsData.findAll({}).then((result) => {
      res.json(result)
    })
  })

  //API for single result in table jsMethodsData
  app.get('/api/js/methods/:name', (req, res) => {
    db.jsMethodsData.findAll({ where: { method: req.params.name } }).then((result) => {
      res.json(result)
    })
  })


  //API for all data in table HtmlData
  app.get('/api/html/tag', (req, res) => {
    db.HtmlData.findAll({}).then((result) => {
      res.json(result)
    })
  })

  //API for single result in table HtmlData
  app.get('/api/html/tag/:name', (req, res) => {
    db.HtmlData.findAll({ where: { tag: req.params.name } }).then((result) => {
      res.json(result)
    })
  })


  // Call this to send lesson email to a single user upon signup
  function singleSend(fn, em) {

    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'projectgroupLynx@gmail.com',
        pass: 'project-2'
      }
    });

    let contents = `
<h2>Welcome, ${fn}.</h2>
</br>
<p>You have been enrolled into our daily lessons program.</p>
</br>
<p>Starting tomorrow, you will receive our lesson by email every day at 7:00 AM CT.</p>
</br>
<p>Prepare to become smarter every day!</p>
</br>
<p>Sincerely,</p>
<h3>Your friends at <strong>Group Lynx</strong></h3>
`;

    // Send mail with defined transport object
    transporter.sendMail({
      from: '"Group Lynx 👻" <projectgroupLynx@gmail.com>', // sender address
      to: em,
      cc: 'projectgrouplynx@gmail.com',
      subject: "Greetings from Group Lynx",
      html: contents // message body
    });

  }     // End of singleSend()


  app.get("/api/users", (req, res) => {

    db.users.findAll({}).then(function (result) {
      res.json(result);
    });
  })
  // SIGN UP AND LOGIN 
  app.post("/api/signup", (req, res) => {
    //SIGN UP OR LOGIN  LOGIC
    //CHECK IF VALUE IS 1 OR 0
    //IF VALUE IS  0 WE WILL REGISTER THE USER
    //IF VALUE IS  1 WE WILL LOG THE USER IN
    if (req.body.loginActive === "0") {

      db.users.count({
        where: { email: req.body.email }
      }).then(function (checkEmailData) {
        if (checkEmailData > 0) {

          console.log("You have an account with Us Please login")

        } else {
          const firstName = req.body.firstName
          const lastName = req.body.lastName
          const email = req.body.email;
          const password = req.body.password


          //SIGN UP USER
          bcrypt.hash(password, saltRounds, function (err, hash) {
            // Store hash in your password DB.
            db.users.create({
              userFirstName: firstName,
              userLastName: lastName,
              email: email,
              password: hash

            }).then(function (result) {

              singleSend(firstName, email);

              var user_id = result.id;
              console.log("Success Sign up")
              console.log(user_id)
              req.login(user_id, function (err) {
                res.redirect('/');
              })

            })
          });



        }
      })
      //

    } else {
      db.users.count({
        where: { email: req.body.email }
      }).then(function (checkEmailData) {
        if (checkEmailData === 0) {

          console.log("Please Sign Up")

        } else {

          //Login
          db.users.findAll(
            {
              where: { email: req.body.email }
            }
          ).then(function (result) {
            bcrypt.compare(req.body.password, result[0].password, function (err, results) {
              // res == true
              if (err) {
                console.log(err)

              };
              if (!results) {
                console.log("Please Check your Email and Password")

              } else {

                var user_id = result[0].id;
                console.log(user_id)
                console.log("Success Login")
                req.login(user_id, function (err) {
                  res.redirect('/');
                })
              }
            });


          });



        }
      })

    }




  })





  //PROFILE ROUTE
  //CHECK IF SESSION ID EXIST
  app.get("/api/check/session/profile", (req, res) => {
    const session = {
      user_id: req.user,
      isSessionActive: req.isAuthenticated()
    }

    res.json(session)

  })

  // SINGLE  PROFILE ROUTE
  app.get("/api/user/:id", (req, res) => {

    db.users.findAll({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  })
  //LOGOUT 
  app.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy()
    res.redirect('/');
  });


};


passport.serializeUser((user_id, done) => {
  done(null, user_id)
});
passport.deserializeUser((user_id, done) => {
  done(null, user_id)
});

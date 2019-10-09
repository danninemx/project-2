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


  // Get contents for lesson email
  app.get("/api/email/:lessonId", function (req, res) {
    db.guide.findAll({
      where: {
        lessonId: req.params.lessonId, // parameter is lessonId
        paragraph: {
          [Op.lt]: 4 // < 4 rows of data.
        },
        // Arrange in ascending order of "paragraph" column
        order: db.sequelize.col('paragraph')
      }
    }).then(function (results) {
      console.log(results);
      res.json(results);
    });
  });

  // Get contents for full guide on website
  app.get("/api/guide/:lessonId", function (req, res) {
    db.guide.findAll({
      where: {
        lessonId: req.params.lessonId, // parameter is lessonId
        // Arrange in ascending order of "paragraph" column
        order: db.sequelize.col('paragraph')
      }
    }).then(function (results) {
      res.json(results);
    });
  });



  app.get("/api/users", (req, res) => {

    db.users.findAll({}).then(function (result) {
      res.json(result);
    });
  })
  // SIGN UP AND LOGIN 
  app.post("/api/signup", (req, res) => {
    //SIGN UP OR LOGIN  LOGIC
    //CHECK IF VALUE IS 1 OR 0
    //IF VALUE IS  0 WE WILL REGISTER THE USER
    //IF VALUE IS  1 WE WILL LOG THE USER IN
    if (req.body.loginActive === "0") {

      db.users.count({
        where: { email: req.body.email }
      }).then(function (checkEmailData) {
        if (checkEmailData > 0) {

          console.log("You have an account with Us Please login")

        } else {
          const firstName = req.body.firstName
          const lastName = req.body.lastName
          const email = req.body.email;
          const password = req.body.password





          //SIGN UP USER
          bcrypt.hash(password, saltRounds, function (err, hash) {
            // Store hash in your password DB.
            db.users.create({
              userFirstName: firstName,
              userLastName: lastName,
              email: email,
              password: hash


            }).then(function (result) {
              //CALL THE  addEmailToMailhchimp() FUNCTION TO ADD THE EMAIL TO THE MAILCHIMP SERVER
              saveEmailToMailchimp(result.email, result.userFirstName, result.userLastName)
              //CALL THE  sendWelcomeMessage() FUNCTION TO SEND A WELCOME MESSAGE

              sendWelcomeMessage(result.email, result.userFirstName, result.userLastName, result.lastLessonId)

              var user_id = result.id;
              console.log("Success Sign up")
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

          console.log("Please Sign Up")

        } else {

          //Login
          db.users.findAll(
            {
              where: { email: req.body.email }
            }
          ).then(function (result) {
            bcrypt.compare(req.body.password, result[0].password, function (err, results) {
              // res == true
              if (err) {
                console.log(err)

              };
              if (!results) {
                console.log("Please Check your Email and Password")

              } else {

                var user_id = result[0].id;
                console.log(user_id)
                console.log("Success Login")
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

const saveEmailToMailchimp = function (email, firstName, lastName) {

  var options = {
    method: 'POST',
    url: 'https://us20.api.mailchimp.com/3.0/lists/5544bea55b/members',
    headers:
    {
      Authorization: apiKey,
      'Content-Type': 'application/json'
    },
    body:
    {
      email_address: email,
      status: 'subscribed',
      merge_fields:
      {
        FNAME: firstName,
        LNAME: lastName
      }
    },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      console.log(body);
    }


  });
}

const sendWelcomeMessage = function (email, firstName, lastName, lastLessonId) {
  console.log("Email send")
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
      from: '"Group Lynx 👻" <projectgroupLynx@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Hello ' + firstName + ' ' + lastName, // Subject line
      text: 'Hello world?', // plain text body
      html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <style type="text/css">
            ul{
                list-style-type: none;
            }
            .wrapper{
                background-color: brown;
                width: 90%;
                margin:  0 auto;
            }
            .title{
                text-align: center;
                letter-spacing: 5px;
                background-color: plum;
                font-size: 30px;
            }
            .container{
                width: 90%;
                margin: 0 auto;
            }
            .container-fluid{
                width: 100%;
                margin: 0 auto;
            }
            .row{
                background-color: yellowgreen;
            }
            .col-md-6{
                float: left;
                width: 50%;
            }
            .center{
                text-align: center;
            }
            .left{
                text-align: left;
                padding-left: 10px;
            }
            .footer{
        position: fixed;
          left: 0;
          bottom: 0;
          width: 100%;
          background-color: plum;
          
          
            }
            
            /* For desktop: */
        .col-1 {width: 8.33%;}
        .col-2 {width: 16.66%;}
        .col-3 {width: 25%;}
        .col-4 {width: 33.33%;}
        .col-5 {width: 41.66%;}
        .col-6 {width: 50%;}
        .col-7 {width: 58.33%;}
        .col-8 {width: 66.66%;}
        .col-9 {width: 75%;}
        .col-10 {width: 83.33%;}
        .col-11 {width: 91.66%;}
        .col-12 {width: 100%;}
        
            @media only screen and (max-width: 768px) {
          /* For mobile phones: */
          [class*="col-"] {
            width: 100%;
          }
        }
        
            </style>
            <title></title>
        </head>
        <body>
            <div class="wrapper" style="background-color: brown;width: 90%;margin: 0 auto;">
                <div class="container-fluid" style="width: 100%;margin: 0 auto;">
                    <h1 class="title" style="text-align: center;letter-spacing: 5px;background-color: plum;font-size: 30px;">${firstName} LYNX WELCOMES YOU!</h1>
                </div>
                <div class="container" style="width: 90%;margin: 0 auto;">
                    <div class="row" style="background-color: yellowgreen;">
                        <div class="col-md-6 center" style="float: left;width: 50%;text-align: center;">
                            <h2>Lessons To pick</h2>
                            <div class="container" style="width: 90%;margin: 0 auto;">
                                <ul class="ul" style="list-style-type: none;">
                                    <li class="col-12 left" style="text-align: left;padding-left: 10px;width: 100%;">Javascript</li>
                                    <li class="col-12 left" style="text-align: left;padding-left: 10px;width: 100%;">node js</li>
                                    <li class="col-12 left" style="text-align: left;padding-left: 10px;width: 100%;">css</li>
                                    <li class="col-12 left" style="text-align: left;padding-left: 10px;width: 100%;">Express</li>
                                    <li class="col-12 left" style="text-align: left;padding-left: 10px;width: 100%;">npm</li>
                                </ul>
                            </div>
        
                        </div>
                        <div class="col-md-6 center" style="float: left;width: 50%;text-align: center;">
                            <h2>You have ${lastLessonId}  Lessons</h2>
                            <div class="container" style="width: 90%;margin: 0 auto;">
                                    <ul class="ul" style="list-style-type: none;">
                                        <li class="col-12 left" style="text-align: left;padding-left: 10px;width: 100%;"></li>
                                        <li class="col-12 left" style="text-align: left;padding-left: 10px;width: 100%;"></li>
                                        <li class="col-12 left" style="text-align: left;padding-left: 10px;width: 100%;"></li>
                                        <li class="col-12 left" style="text-align: left;padding-left: 10px;width: 100%;"></li>
                                        <li class="col-12 left" style="text-align: left;padding-left: 10px;width: 100%;">npm</li>
                                    </ul>
                                </div>
        
                            
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer" style="position: fixed;left: 0;bottom: 0;width: 100%;background-color: plum;">
                <div class="container" style="width: 90%;margin: 0 auto;">
                    <div class="row" style="background-color: yellowgreen;">
                        <div class="col-sm-12 col-md-6 col-lg-6" style="float: left;width: 50%;">
                                <p class="copy-rights">Copy Rights Group LYNX  2019</p>
        
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6" style="float: left;width: 50%;">
                            <p class="github">GitHub</p>
        
                        </div>
                    </div>
                </div>
            </div>
            
        </body>
        </html>`  // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  }

  main()
}

var db = require("../models");
var express = require("express");
const passport = require('passport');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const Sequelize = require("sequelize");
const Op = Sequelize.Op; // Sequelize querying operator


module.exports = function (app) {
  // Get all examples
  app.get("/api/examples", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  // Get contents for lesson email
  app.get("/api/email/:lessonId", function(req, res) {
    db.guide.findAll({
      where: {
        lessonId: req.params.lessonId, // parameter is lessonId
        paragraph: {
          [Op.lt]: 4 // < 4 rows of data.
        },
        // Arrange in ascending order of "paragraph" column
        order: db.sequelize.col('paragraph')
      }
    }).then(function(results) {
      res.json(results);
    });
  });

  // Get contents for full guide on website
  app.get("/api/guide/:lessonId", function(req, res) {
    db.guide.findAll({
      where: {
        lessonId: req.params.lessonId, // parameter is lessonId
        // Arrange in ascending order of "paragraph" column
        order: db.sequelize.col('paragraph')
      }
    }).then(function(results) {
      res.json(results);
    });
  });

  // Create a new example
  app.post("/api/examples", function (req, res) {
    db.Example.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  app.get("/api/signup", (req, res) => {

    db.users.findAll({}).then(function (result) {
      res.json(result);
    });
  })
  app.post("/api/signup", (req, res) => {
    //SIGN UP OR LOGIN  LOGIC
    //CHECK IF VALUE IS 1 OR 0
    //IF VALUE IS  0 WE WILL REGISTER THE USER
    //IF VALUE IS  1 WE WILL LOGIN THE USER
    if (req.body.loginActive === "0") {

      db.users.count({
        where: { email: req.body.email }
      }).then(function (checkEmailData) {
        if (checkEmailData > 0) {

          console.log("You have an account with Us Please login")

        } else {
          const email = req.body.email;
          const password = req.body.password

          //SIGN UP USER
          bcrypt.hash(password, saltRounds, function (err, hash) {
            // Store hash in your password DB.
            db.users.create({
              email: email,
              password: hash

            }).then(function (result) {


              const user_id = result.id;
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

                const user_id = result[0].id;
                console.log("Success Login")
                console.log(user_id)

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
  app.get("/api/profile", (req, res) => {
    res.json(req.user)

  })

  // FIND SINGLE PROFILE ROUTE
  app.get("/api/signup/:id", (req, res) => {

    db.users.findAll({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  })


};

//Passport serializeUser and deserializeuser
passport.serializeUser((user_id, done) => {
  done(null, user_id)
});
passport.deserializeUser((user_id, done) => {
  done(null, user_id)
});
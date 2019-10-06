var db = require("../models");
var express = require("express");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var xvalidator = require('express-validator');
var bcrypt = require('bcryptjs');
var saltRounds = 10;


module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  app.get("/api/users", (req,res)=>{
    
    db.users.findAll({}).then(function(result) {
      res.json(result);
    });
  })
// SIGN UP AND LOGIN 
    app.post("/api/signup", (req,res)=>{
          //SIGN UP OR LOGIN  LOGIC
          //CHECK IF VALUE IS 1 OR 0
          //IF VALUE IS  0 WE WILL REGISTER THE USER
          //IF VALUE IS  1 WE WILL LOG THE USER IN
          if(req.body.loginActive === "0"){
           
            db.users.count({ 
              where: { email: req.body.email }
            }).then(function(checkEmailData){
              if( checkEmailData > 0){
              
              console.log("You have an account with Us Please login")
      
              }else{
                const firstName = req.body.firstName
                const lastName = req.body.lastName
                const email = req.body.email;
                const password = req.body.password
      

      
                //SIGN UP USER
               bcrypt.hash(password, saltRounds, function(err, hash) {
                  // Store hash in your password DB.
                  db.users.create({
                    userFirstName: firstName,
                    userLastName: lastName,
                    email: email,
                    password: hash
      
      
                  }).then(function(result){
                   
                   
                    var user_id = result.id;
                    console.log("Success Sign up")
      console.log(user_id)
                    req.login(user_id, function(err){
                    res.redirect('/');
                    })
                  
                  })
                });
                
                
      
              }
            })
      //
      
          }else{
            db.users.count({ 
              where: { email: req.body.email }
            }).then(function(checkEmailData){
              if( checkEmailData === 0){
              
              console.log("Please Sign Up")
      
              }else{
      
                //Login
                db.users.findAll(
                  {
                    where: {email: req.body.email}
                    }
                    ).then(function(result) {
                      bcrypt.compare(req.body.password,result[0].password, function(err, results) {
                        // res == true
                        if(err){
                          console.log(err)
                          
                        };
                        if(!results){
                          console.log("Please Check your Email and Password")
      
                        }else{
                       
                     var user_id = result[0].id;
                      console.log(user_id)
                    console.log("Success Login")
                     req.login(user_id, function(err){
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
  app.get("/api/check/session/profile", (req,res)=>{
   const session = {
     user_id: req.user,
     isSessionActive: req.isAuthenticated()
   }
     
    res.json(session)
   
  })
  //PROFILE ROUTE
  app.get("/api/profile", (req,res)=>{
    const session = {
      user_id: req.user,
      isSessionActive: req.isAuthenticated()
    }
      
     db.users.findAll({
       where: {id: session.user_id}
     }).then(function(result){
       console.log(result)
       res.json(result)
     })
    
   })
// SINGLE  PROFILE ROUTE
  app.get("/api/user/:id", (req,res)=>{
    
    db.users.findAll({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  })
//LOGOUT 
  app.get('/logout', function(req, res){
    req.logout();
    req.session.destroy()
    res.redirect('/');
  });
};


passport.serializeUser((user_id, done)=>{
  done(null, user_id)
});
passport.deserializeUser((user_id, done)=>{
  done(null, user_id)
});
 
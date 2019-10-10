 var passport = require('passport');
 

// // STORE USER IN THE SESSION
// // passport.serializeUser();
// // RETRIEVES USER FROM THE SESSION
// // passport.deserializeUser();

 module.exports = function passportConfig(app){
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done)=>{
        done(null, user)
    });
    passport.deserializeUser((user, done)=>{
        done(null, user)
    });

  
    

 }
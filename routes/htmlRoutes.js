var db = require("../models");
require("passport");
var moment = require('moment');


module.exports = function (app) {
  //DYNAMIC HEADER 
  // THIS app.use FUNCTION IS USE TO DINAMIC CHECK IF SESSION EXIST GLOBALY
  app.use(function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated()
    console.log(res.locals.isAuthenticated)
    next()
  });
  // Load index page
  app.get("/", function (req, res) {
    res.render("index");
  });


  //LOGIN ROUTE
  app.get("/login", authenticationMiddlewareHome(), function (req, res) {

    res.render("login");
  });

  //PROFILE ROUTE
  app.get("/profile", authenticationMiddleware(), function (req, res) {

    const session = {
      user_id: req.user,
      isSessionActive: req.isAuthenticated()
    }

    db.users.findAll({
      where: { id: session.user_id }
    }).then(function (result) {
      console.log(result[0])
      res.render("profile", {
        msg: result[0].userFirstName,
        user: result[0],
        createdAt: moment(result[0].createdAt, "YYYYMMDD").fromNow()
      });
    })
  });


  //HTML TAGS ROUTE
  app.get('/html/tag', (req, res) => {
    res.render('htmltag')
  })
  //HTML COUNTRY CODES  ROUTE
  app.get('/html/country/codes', (req, res) => {
    res.render('htmlcc')
  })
  //CSS PROPERTIES ROUTE
  app.get('/css/properties', (req, res) => {
    res.render('css')
  })


  // JS METHODS ROUTE
  app.get('/js/methods', (req, res) => {
    db.jsMethodsData.findAll({}).then(function (result) {
      console.log(result)
      res.render('jsmethods', { data: result })
    })
  })

  // SINGLE JS METHOD ROUTE
  app.get('/js/methods/:id', (req, res) => {
    db.jsMethodsData.findAll({ where: { id: req.params.id } }).then((resultSingleMethod) => {
      db.jsMethodsData.findAll({}).then((resultAllData) => {
        var data = { singleData: resultSingleMethod, allData: resultAllData }
        res.render('each', data)
      })
    })
  })


  //COUNTRY CODES ROUTE
  app.get('/server/codes', (req, res) => {
    res.render('serve')
  })
  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};

//THIS authenticationMiddleware FUNCTION IS USE TO CHECK IF USER IS LOGIN SO IT CAN RENDER THE PROFILE PAGE IF IS NOT AUTHENTICATED IT WILL RENDER THE LOGIN PAGE
function authenticationMiddleware() {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login')
    }

  }
}

//THIS authenticationMiddlewareHome FUNCTION IS USE TO CHECK IF USER IS ACTIVE. IF USER IS ACTIVE IT WILL PREVENT THE USER GOING BACK TO THE LOGIN PAGE, UNLESS USER LOGOUT
function authenticationMiddlewareHome() {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    } else {

      res.redirect('/')
    }

  }
}



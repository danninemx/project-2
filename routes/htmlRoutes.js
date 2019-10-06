var db = require("../models");
require("passport");


module.exports = function(app) {
  //DINAMIC HEADER 
// THIS app.use FUNCTION IS USE TO DINAMIC CHECK IF SESSION EXIST GLOBALY
  app.use(function(req,res,next){
    res.locals.isAuthenticated = req.isAuthenticated()
    console.log(res.locals.isAuthenticated)
    next()
  });
  // Load index page
  app.get("/", function(req, res) {
  
    
    
   db.Example.findAll({}).then(function(dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });

 
//LOGIN ROUTE
  app.get("/login", function(req, res) {
    
    res.render("login");
  });
  //PROFILE ROUTE
app.get("/profile", authenticationMiddleware(), function(req, res) {
  const session = {
    user_id: req.user,
    isSessionActive: req.isAuthenticated()
  }
    
   db.users.findAll({
     where: {id: session.user_id}
   }).then(function(result){
     console.log(result)
     res.render("profile", {
      msg: "Alex",
      data: result
    });
   })
    
  });
  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });
 
  app.get('/settings',(req,res)=>{
    res.render('settings')
  })

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};

//THIS authenticationMiddleware FUNCTION IS USE TO CHECK IF USER IS LOGIN SO IT CAN RENDER THE PROFILE PAGE IF IS NOT AUTHENTICATED IT WILL RENDER THE LOGIN PAGE
function authenticationMiddleware () {  
	return (req, res, next) => {
	 if (req.isAuthenticated()) return next();
	    res.redirect('/login')
	}
}


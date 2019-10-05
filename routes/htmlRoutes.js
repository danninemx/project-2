var db = require("../models");
require("passport");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    console.log(req.user);
    console.log(req.isAuthenticated());
    db.Example.findAll({}).then(function(dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });

  app.get("/login", function(req, res) {
    res.render("login");
  });
  //Profile

  app.get("/profile", function(req, res) {
    res.render("profile", {
      msg: "Welcomen Alex!"
    });
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

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};

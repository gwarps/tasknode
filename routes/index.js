module.exports = exports = function(app, db) {
   require("./tasks")(app, db);
   require("./posts")(app, db);

   app.get("/", function(req, res) {
      res.render("index", {title: "Express"});
   });

}

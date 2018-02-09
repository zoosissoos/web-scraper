const express = require("express");
const bodyParser = require("body-parser");
const router = require('./controllers/scrapcontroller');
const exphbs = require("express-handlebars");
const mongoose  = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine("handlebars", exphbs({ defaultLayout: "index" }));
app.set("view engine", "handlebars");

app.use(router);

app.listen(port, function() {
  console.log("listening on port", port);
});
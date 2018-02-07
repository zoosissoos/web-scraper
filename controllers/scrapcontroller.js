const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const db = require('../models/');
const axios = require("axios");
const cheerio = require("cheerio");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/");

router.get('/', function (req, res) {
  res.render('greeting');
});

router.get('/dashboard', function (req, res) {
  res.render('dashboard');
});


router.get("/scrape", function(req, res) {
  axios.get("http://www.mlbtraderumors.com").then(function(response) {
    const $ = cheerio.load(response.data);
    $(".entry-title").each(function(i, element) {
      var result = {};
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      result.isSaved = false;

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    res.json(dbArticle);
  });
});

// Route for getting all Articles from the db
router.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({isSaved:false})
    .then(function(dbArticle) {
      console.log(dbArticle)
      // If we were able to successfully find Articles, send them back to the client
      res.render('dashboard',{"dbArticle" : dbArticle});
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.put("/save",function(req,res){
  let query = {_id : req.body.id}
  console.log(query)
  db.Article.findOneAndUpdate(query ,{isSaved : true}, { new: true })
  .then(function(savedArt){
    console.log(savedArt)
    res.end();
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
})

router.put("/remove",function(req,res){
  let query = {_id : req.body.id}
  console.log(query)
  db.Article.deleteOne(query)
  .then(function(){
    res.end();
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});

router.get("/saved", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({isSaved:true})
    .then(function(dbArticleSaved) {
      console.log(dbArticleSaved)
      // If we were able to successfully find Articles, send them back to the client
      res.render('dashboard',{"dbArticleSaved" : dbArticleSaved});
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.put("/unsave",function(req,res){
  let query = {_id : req.body.id}
  console.log(query)
  db.Article.findOneAndUpdate(query ,{isSaved : false}, { new: true })
  .then(function(savedArt){
    console.log(savedArt)
    res.end();
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
})



module.exports = router;
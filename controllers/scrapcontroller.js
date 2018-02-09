const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const db = require('../models/');
const axios = require("axios");
const cheerio = require("cheerio");

//greeting when visiting site
router.get('/', function (req, res) {
  res.render('greeting');
});

//provides dashboard
router.get('/dashboard', function (req, res) {
  res.render('dashboard');
});

//scrapes
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
      result.isSaved = false
      result.note = [];

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

//saves article
router.put("/save",function(req,res){
  let query = {_id : req.body.id}
  console.log(query)
  db.Article.findOneAndUpdate(query ,{isSaved : true}, { new: true })
  .then(function(savedArt){
    console.log(savedArt)
    res.end();
  })
  .catch(function(err) {
    res.json(err);
  });
})


//removes article
router.put("/remove",function(req,res){
  let query = {_id : req.body.id}
  console.log(query)
  db.Article.deleteOne(query)
  .then(function(){
    res.end();
  })
  .catch(function(err) {
    res.json(err);
  });
});

router.get("/saved", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({isSaved:true})
    .then(function(dbArticleSaved) {
      console.log(dbArticleSaved)
      //renders the article
      res.render('dashboard',{"dbArticleSaved" : dbArticleSaved});
    })
    .catch(function(err) {
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
    res.json(err);
  });
});

router.get("/article/notes/:id", function(req, res) {
  let query = { _id: req.params.id }
  db.Article.findOne(query)
    // ..and populate all of the notes associated with it
    .populate({path: "note", model: 'Note'})
    .then(function(dbArticle) {
      //sends article with notes to client
      console.log(`THIS IS THE RETURNED: ${dbArticle}`)
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      console.log(dbNote)
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: {"note": dbNote._id} }, {new:true, safe: true, upsert: true,overwrite: false});
    })
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//deletes note
router.put("/delete",function(req,res){
  let query = {_id : req.body.id}
  console.log(query)
  db.Note.deleteOne(query)
  .then(function(){
    res.end();
  })
  .catch(function(err) {
    res.json(err);
  });
});

module.exports = router;
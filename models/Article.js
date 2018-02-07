const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ArticleSchema = new Schema({

  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  isSaved: {
    type: Boolean,
    default: false
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

ArticleSchema.methods.saveArticle = function() {
  this.isSaved = true;
  return this.isSaved;
};

ArticleSchema.methods.unsaveArticle = function() {
  this.isSaved = false;
  return this.isSaved;
};

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;

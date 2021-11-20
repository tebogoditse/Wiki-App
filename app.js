//jshint esversion:6

const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/wikiDB');
}

const articlesSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articlesSchema);

app.route('/articles')
  .get((req, res) => {
    Article.find({}, (err, foundArticles) => {
      if (err) {
        res.send(err);
      }
      res.send(foundArticles);
    });
  })
  .post((req, res) => {

    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });
  
    Article.create(article, (err, newArticle) => {
      if (err){
        res.send(err);
      }
      res.send(newArticle);
    });
  })
  .delete((req, res) => {
    Article.db.dropCollection('articles', (err, result) => {
      if (err) {
        throw err;
      }
      res.send(result);
    });
  });

app.route('/articles/:specificArticle')
  .get((req, res) => {
    Article.findOne({title: req.params.specificArticle}, (err, result) => {
      if (err) {
        throw err;
      }
      res.send(result);
    })
  })
  .put((req, res) => {
    const articleUpdate = {
      title: req.body.title,
      content: req.body.content
    };

    Article.updateOne({title: req.params.specificArticle}, articleUpdate, (err, update) => {
      if (err) {
        throw err;
      }
      res.send(update);
    });
  })
  .patch((req, res) => {
    Article.updateOne({title: req.params.specificArticle}, {$set: req.body}, (err, updatedArticle) => {
      if (err) {
        throw err;
      }
      res.send(updatedArticle)
    });
  })
  .delete((req, res) => {
    Article.deleteOne({title: req.params.specificArticle}, err => {
      if (err) {
        throw err;
      }
      res.send("Article successfully deleted");
    });
  });  

app.listen(3000, () => {
    console.log("Now running on post 3000");
});
var express = require("express"),
    routes = express.Router(),
    request = require("request"),
    cheerio = require("cheerio");


var Article = require("../models/Article.js");
var Note = require("../models/Note.js");



routes.get("/scrape", function (req, res) {
    var result = {};
    var arr = [];
    request("https://www.nytimes.com", function (err, response, html) {
        var $ = cheerio.load(html);

        $(".collection .theme-summary").each(function (i, element) {
                result.title = $(this).children(".story-heading").text().trim();
                result.link = $(this).children(".story-heading").children().attr("href");
                result.summary = $(this).children(".summary").text().trim()
                result.saved = false;

                arr.push({
                    title:result.title,
                    link:result.link,
                    summary: result.summary
                });

                if(result.title !== '' && result.summary !== '' && result.link !== ''){
                    var entry = new Article(result);

                    entry.save(function (err, doc) {
                        if(err) throw err;

                    });
                }
        });

        res.json(arr);

    });





});

routes.get("/", function (req, res) {
  res.render("index");
});


routes.get("/articles", function (req, res) {
    Article.find({saved: false}, function (err, req) {
        if(err) throw err;
        else{
            //console.log(doc);
            res.render("articles", {result:req});
        }
    });
});


routes.get("/articles/:id", function (req, res) {
   Article.findOne({
       "_id": req.params.id
   })
       .populate("note")
       .exec(function (err, req) {
           if(err)throw err;
           res.json(req);
       });


});

routes.get("/saved", function (err, res) {
    Article.find({
        saved: true
    }, function (err, req) {
        if(err) throw err;
        res.render("saved", {data: req});

    });
});

routes.get("api/saved", function (req, res) {
    Article.find({saved: true}, function (error, req) {
        if(error) throw err;
        res.json(req);
    });
});


routes.post("/saved/:id", function (req, res) {
    var id = req.params.id;
    console.log(id);
    Article.findOneAndUpdate({"_id": id}, {saved: true}, function (err, req) {
        if(err) throw err;
        res.redirect("/articles");

    });
});

routes.post("/articles/:id", function (req, res) {
    var newNote = new Note(req.body);
    console.log(newNote);
    newNote.save(function (err, req) {
        if(err) throw err;
        Article.findOneAndUpdate({"_id": req.params.id}, {"note": req._id})
            .exec(function (err, req) {
                if(err) throw err;
                console.log("Note Added!");
                res.redirect("/saved");

            });
    });
});
module.exports = routes;
/* Scraper: Server #3  (18.2.1)
 * ========================= */

// Dependencies:
var express = require("express"),
    handlebars = require("express-handlebars"),
    mongoose = require("mongoose"),
    logger = require("morgan"),
    bodyParser = require("body-parser");
    
var app = express(),
    PORT = process.env.PORT || 3000;

app.use(logger("dev"));
mongoose.Promise = Promise;

app.use(bodyParser.urlencoded({
    extended: false
}));



if(process.env.MONGODB_URI){
    mongoose.connect(mongodb://heroku_brsh2vlc:s4gg854oa9e0nt44rqiq7l203e@ds011241.mlab.com:11241/hero
ku_brsh2vlc);
} else{
    mongoose.connect("mongodb://localhost/nytimes");
}

var db = mongoose.connection;
db.on("error", function (err) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function () {
    console.log("Mongoose connection successful.");
});


app.use(express.static('public'));

var routes = require("./controllers/routes.js"),
    api = require("./controllers/api.js");

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//app.use(express.static("./app/public"));

app.use("/", routes);

app.listen(PORT, function () {
    console.log("App's listening at PORT ", PORT);
});    
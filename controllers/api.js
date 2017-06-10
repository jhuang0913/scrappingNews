var express = require("express"),
	routes = express.Router(),
	request = require("request"),
	cheerio = require("cheerio");

var scrapedData = function (res) {
	
	request("https://www.nytimes.com", function (err, response, html) {
	    var $ = cheerio.load(html);

	    var result = [];

	    $(".collection .theme-summary").each(function (i, element) {
	        var title = $(this).children(".story-heading").text().trim(),
	        	link = $(this).children(".story-heading").children().attr("href"),
	        	summary = $(this).children(".summary").text().trim();

	        result.push({
	            title: title,
                link:link,
	            summary:summary
	        });
	        

    	});

    	res.json(result);

	})};
 


routes.get("/data", function (req, res) {
   scrapedData(res);
});

module.exports = routes;
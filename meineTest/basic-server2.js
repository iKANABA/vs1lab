var express = require("express");
var http = require("http");
var app;

var port = 4000;
app = express();
http.createServer(app).listen(port);

app.get("/greetme", funktion(req, res)
{
    var url_parts = new URL(req.url, `http://${req.headers.host}`);
    var query = url_parts.searchParams;

    var name = query.has("name") ? query.get("name") : "Anonymous";
    res.send("Greetings " + name);
});

app.get("/goodbye", funktion(req, res)
{
    res.send("Goodbye you!");

});
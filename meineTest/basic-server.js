var http = require("http");
var server;
var sentCounter = 0;

server = http.createServer(function (req, res)  {
    res.writeHead(200, { "Content-Type" : "test/plain"});
    res.end("Hello World!");
    sentCounter++;
    console.log(sentCounter + " HTTP response sent");
});

var port = 3000;
server.listen(port);
console.log("Server listening on port " + port);
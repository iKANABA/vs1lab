/**
 * Template für Übungsaufgabe VS1lab/Aufgabe3
 * Das Skript soll die Serverseite der gegebenen Client Komponenten im
 * Verzeichnisbaum implementieren. Dazu müssen die TODOs erledigt werden.
 */

/**
 * Definiere Modul Abhängigkeiten und erzeuge Express app.
 */

var http = require('http');
//var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var express = require('express');
var url= require("url");

var app;
app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
// Setze ejs als View Engine
app.set('view engine', 'ejs');

/**
 * Konfiguriere den Pfad für statische Dateien.
 * Teste das Ergebnis im Browser unter 'http://localhost:3000/'.
 */

// TODO: CODE ERGÄNZEN
app.use(express.static(__dirname + "/public"));




var id=(function(){

    var global_id=0;

    return{

        generateId: function(){

            global_id++;
            return global_id;
        }

    }

    }
)();
/**
 * Konstruktor für GeoTag Objekte.
 * GeoTag Objekte sollen min. alle Felder des 'tag-form' Formulars aufnehmen.
 */

// TODO: CODE ERGÄNZEN
function GeoTagFunc(name, latitude, longitude, hashtag) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.hashtag = hashtag;
    this.id=id.generateId();

};

/**
 * Modul für 'In-Memory'-Speicherung von GeoTags mit folgenden Komponenten:
 * - Array als Speicher für Geo Tags.
 * - Funktion zur Suche von Geo Tags in einem Radius um eine Koordinate.
 * - Funktion zur Suche von Geo Tags nach Suchbegriff.
 * - Funktion zum hinzufügen eines Geo Tags.
 * - Funktion zum Löschen eines Geo Tags.
 */

// TODO: CODE ERGÄNZEN
var geoTaggingModule = (function() {
    let arr = [];
    
    return {


        pushedit: function(obj,i) {
            arr[i]=obj;
            arr[i].id=i+1;
            return;
        },


        pushobj: function(obj) {
            arr.push(new GeoTagFunc(obj.name, obj.latitude, obj.longitude, obj.hashtag));
console.log(arr);
            return arr;
        },
        add: function(name, latitude, longitude, hashtag) {
            arr.push(new GeoTagFunc(name, latitude, longitude, hashtag));
        
            return arr;
        },
        del: function(term) {
        
            var getelem;
        
            getelem = arr.filter(grab => grab.name != term && grab.hashtag != term && grab.id!=term);
        
            arr = getelem;
        
        },
        searchrad: function(latc, longc, array, rad) {
            var radfilarr = [];
        
            for (var i = 0; i < array.length; i++) {
        
                var p = 0.017453292519943295;    //This is  Math.PI / 180
                var cosi = Math.cos;
                var calca = 0.5 - cosi((array[i].latitude - latc) * p) / 2 +
                    cosi(latc * p) * cosi(array[i].latitude * p) *
                    (1 - cosi((array[i].longitude - longc) * p)) / 2;
                var R = 6371; //  Earth distance in km so it will return the distance in km
                var dists = 2 * R * Math.asin(Math.sqrt(calca));
                console.log(dists + "Km");
                if (dists <= rad) {
                    radfilarr.push(array[i]);
        
                }
            }
        
            return radfilarr;
        },
        searchterm: function (term) {
            let filtered = [];
        
        
            filtered = arr.filter(grab => grab.name == term || grab.hashtag==term||grab.id==term||grab.latitude==term||grab.longitude==term);
            return filtered;
        },
        searchid: function (term) {
            let filtered = [];


            filtered = arr.filter(grab => grab.id==term);
            return filtered;
        },
        getArray: function() {
            return arr;
        }
    };
})();


/**
 * Route mit Pfad '/' für HTTP 'GET' Requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests enthalten keine Parameter
 *
 * Als Response wird das ejs-Template ohne Geo Tag Objekte gerendert.
 */

app.get('/', function (req, res) {

    res.render('gta', {
        tagliste: [],
        filterarr: "[]",
        lat: [],
        long: [],
        hlat: req.body.hiddenLatitude,
        hlong: req.body.hiddenLongitude
    });

});

/**
 * Route mit Pfad '/tagging' für HTTP 'POST' Requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests enthalten im Body die Felder des 'tag-form' Formulars.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Mit den Formulardaten wird ein neuer Geo Tag erstellt und gespeichert.
 *
 * Als Response wird das ejs-Template mit Geo Tag Objekten gerendert.
 * Die Objekte liegen in einem Standard Radius um die Koordinate (lat, lon).
 */

// TODO: CODE ERGÄNZEN START



//make obj
app.post('/poster',function(req,res){
    var fruits =req.body;
    console.log(fruits);

      geoTaggingModule.pushobj(fruits);
    res.status(201);
    res.render('minigta', {
        tagliste: geoTaggingModule.getArray(),

    });

});



//search objs
app.get('/geotags',function(req,res){
    var query=url.parse(req.url,true).query;
    console.log(query["searchterm"]);
    if(query["searchterm"]!==undefined&&query["searchterm"]!=="") {
        var filteredarr = geoTaggingModule.searchterm(query["searchterm"]);
        //filteredarr = geoTaggingModule.searchrad(req.body.hiddenLatitude, req.body.hiddenLongitude, filteredarr, 30);

        res.render('minigta', {
            tagliste: filteredarr,

        });

    }else{res.render('minigta', {
        tagliste: geoTaggingModule.getArray(),

    })}

    //res.send(JSON.stringify(filteredarr));
    //res.end();

});

//render all objs
   app.get('/geotags/all',function(req,res){

            res.send(JSON.stringify(geoTaggingModule.getArray()));

        });



//delete obj
app.delete('/geotags/delete/:id',function(req,res){
    console.log(req.params.id);
    geoTaggingModule.del(req.params.id);
    //filteredarr = geoTaggingModule.searchrad(req.body.hiddenLatitude, req.body.hiddenLongitude, filteredarr, 30);


    res.render('minigta', {
        tagliste: geoTaggingModule.getArray(),

    });

});



//suche mit id
app.get('/geotags/:id',function(req,res){


    var filteredarr = geoTaggingModule.searchid(req.params.id);
    res.render('minigta', {
        tagliste: filteredarr,

    });
});




//JSON string für neue Map
app.get('/geotags/map',function(req,res){
    var query=url.parse(req.url,true).query;

    if(query["searchterm"]!==undefined) {
        var filteredarr = geoTaggingModule.searchterm(query["searchterm"]);
        //filteredarr = geoTaggingModule.searchrad(req.body.hiddenLatitude, req.body.hiddenLongitude, filteredarr, 30);


        res.send(JSON.stringify(filteredarr));


    }else{
        res.send(JSON.stringify(geoTaggingModule.getArray()));

    }


//res.end();
});
//´´´´´´´´´´´´´´


//obj ändern
app.put('/geotags/change/:id',function(req,res){
    console.log(req.params.id);
    console.log(req.body);
    var data=req.body;
geoTaggingModule.pushedit(data,req.params.id-1);



    res.render('minigta', {
        tagliste: geoTaggingModule.getArray(),

    });



});




//----------------------------------------------------------------//
app.post('/tagging', function (req, res) {

    geoTaggingModule.add(req.body.name, req.body.latitude, req.body.longitude, req.body.hashtag);

    res.render('gta', {
        tagliste: geoTaggingModule.getArray(),
        filterarr: JSON.stringify(geoTaggingModule.getArray()), //"[]"
        lat: req.body.latitude,
        long: req.body.longitude,
        hlat: req.body.hiddenLatitude,
        hlong: req.body.hiddenLongitude
    });
});


/**
 * Route mit Pfad '/discovery' für HTTP 'POST' Requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests enthalten im Body die Felder des 'filter-form' Formulars.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Als Response wird das ejs-Template mit Geo Tag Objekten gerendert.
 * Die Objekte liegen in einem Standard Radius um die Koordinate (lat, lon).
 * Falls 'term' vorhanden ist, wird nach Suchwort gefiltert.
 */

// TODO: CODE ERGÄNZEN
app.post('/discovery', function (req, res) {

    if (req.body.filter == 'go filter' && req.body.searchQuery != undefined) {
        var filteredarr = geoTaggingModule.searchterm(req.body.searchQuery);
        filteredarr = geoTaggingModule.searchrad(req.body.hiddenLatitude, req.body.hiddenLongitude, filteredarr, 30);


        res.render('gta', {
            tagliste: filteredarr,
            filterarr: JSON.stringify(filteredarr),
            lat: req.body.latitude,
            long: req.body.longitude,
            hlat: req.body.hiddenLatitude,
            hlong: req.body.hiddenLongitude
        });


    }

    if (req.body.throw == 'delete') {

        geoTaggingModule.del(req.body.searchQuery);


        res.render('gta', {
            tagliste: geoTaggingModule.getArray(),
            filterarr: JSON.stringify(geoTaggingModule.getArray()),  //"[]",
            lat: req.body.latitude,
            long: req.body.longitude,
            hlat: [],
            hlong: []
        });
    }

    if (req.body.all == 'show all') {
        res.render('gta', {
            tagliste: geoTaggingModule.getArray(),
            filterarr:  JSON.stringify(geoTaggingModule.getArray()),   //"[]",
            lat: req.body.latitude,
            long: req.body.longitude,
            hlat: [],
            hlong: []
        });
    }

});


/**
 * Setze Port und speichere in Express.
 */

var port = 3000;
app.set('port', port);

/**
 * Erstelle HTTP Server
 */

var server = http.createServer(app);

/**
 * Horche auf dem Port an allen Netzwerk-Interfaces
 */

server.listen(port);

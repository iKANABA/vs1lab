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
        add: function(name, latitude, longitude, hashtag) {
            arr.push(new GeoTagFunc(name, latitude, longitude, hashtag));

            return arr;
        },
        del: function(term) {

            var getelem;

            getelem = arr.filter(grab => grab.name != term && grab.hashtag != term);

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


            filtered = arr.filter(grab => grab.name == term || grab.hashtag == term);
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


//**********************************************************************

    //TODO





//**********************************************************************

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
app.post('/tagging', function (req, res) {

    geoTaggingModule.add(req.body.name, req.body.latitude, req.body.longitude, req.body.hashtag);

    res.render('gta', {
        tagliste: geoTaggingModule.getArray(),
        filterarr: JSON.stringify(geoTaggingModule.getArray()), //"[]", //geoTaggingModule.getArray(),
        lat: req.body.latitude,
        long: req.body.longitude,
        hlat: req.body.hiddenLatitude,
        hlong: req.body.hiddenLongitude,
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
        filteredarr = geoTaggingModule.searchrad(req.body.hiddenLatitude, req.body.hiddenLongitude, filteredarr, 500000);


        res.render('gta', {
            tagliste: filteredarr,
            filterarr: JSON.stringify(filteredarr),
            lat: req.body.latitude,
            long: req.body.longitude,
            hlat: req.body.hiddenLatitude,
            hlong: req.body.hiddenLongitude
            //hlat: req.body.filteredarr.latitude,
            //hlong: req.body.filteredarr.longitude,
        });


    }

    if (req.body.throw == 'delete') {

        geoTaggingModule.del(req.body.searchQuery);


        res.render('gta', {
            tagliste: geoTaggingModule.getArray(),
            filterarr: JSON.stringify(geoTaggingModule.getArray()),
            lat: req.body.latitude,
            long: req.body.longitude,
            hlat: [],
            hlong: []
        });
    }

    if (req.body.all == 'show all') {
        res.render('gta', {
            tagliste: geoTaggingModule.getArray(),
            filterarr: JSON.stringify(geoTaggingModule.getArray()),
            lat: req.body.latitude,
            long: req.body.longitude,
            hlat: [],
            hlong: []
        });
    }

});

/**
 * Tests während API Tutorial.
 */
let geoTags = [
    {tag: 1, location: 'Frankfurt'},
    {tag: 2, location: 'Sandhausen'},
    {tag: 3, location: 'Ettlingen'}
    ];

app.get('/geotags', (req, res) => {
    res.send(geoTags);
});

//filter bsp: /api/courses/:id
app.get('/geotags/:tag', function(req, res) {
    const geoTag = geoTags.find(c => c.tag === parseInt(req.params.tag));
    if(!geoTag) res.status(404).send('Geo Tag nicht gefunden!');

    res.send(geoTag);
});

app.post('/geotags', function(req, res) {
    const newGeoTag = {tag: geoTags.length + 1, location: req.body.name};
    geoTags.push(newGeoTag);
    res.send(newGeoTag);
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

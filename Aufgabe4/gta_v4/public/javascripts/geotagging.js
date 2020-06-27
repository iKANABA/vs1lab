/* Dieses Skript wird ausgeführt, wenn der Browser index.html lädt. */

// Befehle werden sequenziell abgearbeitet ...

/**
 * "console.log" schreibt auf die Konsole des Browsers
 * Das Konsolenfenster muss im Browser explizit geöffnet werden.
 */
console.log("The script is going to start...");

// Es folgen einige Deklarationen, die aber noch nicht ausgeführt werden ...

// Hier wird die verwendete API für Geolocations gewählt
// Die folgende Deklaration ist ein 'Mockup', das immer funktioniert und eine fixe Position liefert.
GEOLOCATIONAPI = {
    getCurrentPosition: function (onsuccess) {
        onsuccess({
            "coords": {
                "latitude": 49.013790,
                "longitude": 8.390071,
                "altitude": null,
                "accuracy": 39,
                "altitudeAccuracy": null,
                "heading": null,
                "speed": null
            },
            "timestamp": 1540282332239
        });
    }
};

// Die echte API ist diese.
// Falls es damit Probleme gibt, kommentieren Sie die Zeile aus.
GEOLOCATIONAPI = navigator.geolocation;

/**
 * GeoTagApp Locator Modul
 */
var gtaLocator = (function GtaLocator(geoLocationApi) {

    // Private Member

    /**
     * Funktion spricht Geolocation API an.
     * Bei Erfolg Callback 'onsuccess' mit Position.
     * Bei Fehler Callback 'onerror' mit Meldung.
     * Callback Funktionen als Parameter übergeben.
     */
    var tryLocate = function (onsuccess, onerror) {
        if (geoLocationApi) {
            geoLocationApi.getCurrentPosition(onsuccess, function (error) {
                var msg;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        msg = "User denied the request for Geolocation.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        msg = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        msg = "The request to get user location timed out.";
                        break;
                    case error.UNKNOWN_ERROR:
                        msg = "An unknown error occurred.";
                        break;
                }
                onerror(msg);
            });
        } else {
            onerror("Geolocation is not supported by this browser.");
        }
    };

    // Auslesen Breitengrad aus der Position
    var getLatitude = function (position) {
        return position.coords.latitude;
    };

    // Auslesen Längengrad aus Position
    var getLongitude = function (position) {
        return position.coords.longitude;
    };

    // Hier Google Maps API Key eintragen
    var apiKey = "CYtZxFxPUaI6CafQ2nhgLgOuArdMcczt";

    /**
     * Funktion erzeugt eine URL, die auf die Karte verweist.
     * Falls die Karte geladen werden soll, muss oben ein API Key angegeben
     * sein.
     *
     * lat, lon : aktuelle Koordinaten (hier zentriert die Karte)
     * tags : Array mit Geotag Objekten, das auch leer bleiben kann
     * zoom: Zoomfaktor der Karte
     */
    var getLocationMapSrc = function (lat, lon, tags, zoom) {

        zoom = typeof zoom !== 'undefined' ? zoom : 15;

        if (apiKey === "YOUR_API_KEY_HERE") {
            console.log("No API key provided.");
            return "images/mapview.jpg";
        }

        var tagList = "&pois=1," + lat + "," + lon;


        if (tags !== undefined) tags.forEach(function (tag) {
            tagList += "|" + tag.name + "," + tag.latitude + "," + tag.longitude;
        });


        var urlString = "https://www.mapquestapi.com/staticmap/v4/getmap?key=" +
            apiKey + "&size=600,400&zoom=" + zoom + "&center=" + lat + "," + lon + "&" + tagList + "&type=hyb";

        console.log("Generated Maps Url: " + urlString);
        return urlString;
    };


    return { // Start öffentlicher Teil des Moduls ...

        // Public Member

        readme: "Dieses Objekt enthält 'öffentliche' Teile des Moduls.",

        updateLocation: function () {


            tryLocate((position) => {
                console.log(position);

                var getstr = $("#result-img").attr("data-tags");            //holt objekte als jason string von filtered array aus dem html attribut
                var getobjk = JSON.parse(getstr);                           //wandelt string in objekt um


                var url = getLocationMapSrc(position.coords.latitude, position.coords.longitude, getobjk);

                $("#result-img").attr("src", url);

                if ($("#latitude").attr("value").length == 0) {

                    console.log(url);

                    $("#tag-form #latitude").val(position.coords.latitude.toFixed(5));
                    $("#tag-form #longitude").val(position.coords.longitude.toFixed(5));

                }

                $("#filter-form #hiddenLatitude").attr("value", position.coords.latitude.toFixed(5));
                $("#filter-form #hiddenLongitude").attr("value", position.coords.longitude.toFixed(5));




            }, (errorMessage) => {
                alert(errorMessage);
            });


        }

    }; // ... Ende öffentlicher Teil
})(GEOLOCATIONAPI);

/**
 * $(function(){...}) wartet, bis die Seite komplett geladen wurde. Dann wird die
 * angegebene Funktion aufgerufen. An dieser Stelle beginnt die eigentliche Arbeit
 * des Skripts.
 */
$(function () {
    gtaLocator.updateLocation();
});

/*********************************************************************/

//var XMLHttprequest = require("xmlhttprequest").XMLHttprequest;

var ajax = new XMLHttpRequest();

ajax.open("GET","/");
ajax.onreadystatechange = function() {
    console.log("readyState = " + this.readyState + ", status = " + this,status);
    if (this.readyState == 4 && this.status == 200) {
        var result = this.responseText;
        console.log(result);
    }
};
ajax.send();
/*
document.getElementById("filter").addEventListener("click", function(event){
    event.preventDefault();
    var ajax = new XMLHttpRequest();

    ajax.open("GET", "/discovery?searchterm=" + document.getElementById("searchQuery").value);
    ajax.send();
});
*/
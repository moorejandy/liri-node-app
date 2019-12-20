require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var moment = require("moment");
var fs = require('fs');

var command = process.argv[2];
function commandSwitch() {
    switch (command) {
        case "spotify-this-song":
            showSong();
            break;
        case "concert-this":
            showConcert();
            break;
        case "movie-this":
            showMovie();
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
    }
}

var input = process.argv.slice(3).join(" ");

function showSong() {
    if (!input) {
        input = "The Sign Ace of Base";

    }
    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: input, limit: 5 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var songs = data.tracks.items;

        for (var i = 0; i < songs.length; i++) {

            var songList = "\nSong title: " + songs[i].name +"\nArtist name: " + songs[i].artists[0].name +
            "\nAlbum title: " + songs[i].album.name + "\nSong preview: " + songs[i].preview_url;

            console.log(songList);

            fs.appendFile("log.txt", "\n" + songList, function (err) {
                if (err) throw err;
                console.log('saved');
            });
        }
    });
}

function showConcert() {

    axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
        .then(function (response) {

            var concerts = response.data;

            var venueDetails = "\nArtist Name: " + concerts[0].artist.name + "\nVenue Name: " + concerts[0].venue.name 
            + "\nVenue City: " + concerts[0].venue.city + "\nConcert date: " + moment(concerts[0].datetime).format('L');

            console.log(venueDetails);

            fs.appendFile("log.txt", "\n" + venueDetails, function (err) {
                if (err) throw err;
                console.log('saved');
            });
        }
        );
}

function showMovie() {
    var axios = require("axios");

    axios.get("http://www.omdbapi.com/?t=" + input + "=&plot=short&apikey=trilogy")
        .then(function (response) {
            
            var movieDeets = "\nMovie Title: " + response.data.Title + "\nYear Released: " + response.data.Year
            + "\nRating: " + response.data.imdbRating + "\nCountry where produced: " + response.data.Country
            + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors;

            console.log(movieDeets);

            fs.appendFile("log.txt", "\n" + movieDeets, function (err) {
                if (err) throw err;
                console.log('saved');
            });

        }
        );

}

function doWhatItSays(){

    fs.readFile("./random.txt", "utf8", function(err, data){
if (err){
    return console.log(err)
}
else{
var output = data.split(",");

command = output[0];
input =  output[1];

showSong();
    }
  });
}

commandSwitch();
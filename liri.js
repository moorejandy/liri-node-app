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

            console.log("Song title: " + songs[i].name);
            console.log("Artist name: " + songs[i].artists[0].name);
            console.log("Album title: " + songs[i].album.name);
            console.log("Song preview: " + songs[i].preview_url);
            console.log("----------------------------");
        }
    });
}

function showConcert() {

    axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
        .then(function (response) {

            var concerts = response.data;

            console.log("----------------")
            console.log(concerts[0].artist.name);
            console.log(concerts[0].venue.name);
            console.log(concerts[0].venue.city);
            console.log(moment(concerts[0].datetime).format('L'));
        }
        );
}

function showMovie() {
    var axios = require("axios");

    // We then run the request with axios module on a URL with a JSON
    axios.get("http://www.omdbapi.com/?t=" + input + "=&plot=short&apikey=trilogy")
        .then(function (response) {
            // Then we print out the imdbRating
            console.log("Movie Title: " + response.data.Title);
            console.log("Year Release: " + response.data.Year);
            console.log("The movie's rating is: " + response.data.imdbRating);
            console.log("Country where the movie was produced: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);

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

console.log(output);

command = output[0];
input =  output.slice(1).join(' ');

showSong();
    }
  });
}

commandSwitch();
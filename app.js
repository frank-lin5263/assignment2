// require and instantiate express
var express = require('express');
const app =  express();
var https = require('https');

// set the view engine to ejs
app.set('view engine', 'ejs')
app.use(require('body-parser')())
app.use(express.static(__dirname + '/public'));

var results = [];

app.get('/', (req, res) => {
    // render `home.ejs`
    res.render('home');
})

app.post('/search', function(req, response) {
    var titleName = req.body.titleName;

    var options = {
        method: "GET",
        host: "api.themoviedb.org",
        port: null,
        path: "/3/search/movie?include_adult=false&page=1&query=" + encodeURIComponent(titleName) + "&language=en-US&api_key=61af336403e37502e5018a18a30d8cee",
        headers: {}
    };

    var httpsReq = https.request(options, function(res) {
        res.on('data', function(chunk) {
            var searchResults = JSON.parse(chunk);
            for(var i = 0; i < searchResults.results.length; i += 1) {
                results[i] = searchResults.results[i];
                if (results[i].poster_path == null) {
                    results[i].poster_path = '/img/logo.jpg'
                } else {
                    results[i].poster_path = "http://image.tmdb.org/t/p/w185" + results[i].poster_path;
                }
            };
        });
        res.on('error', function(e) {
            console.log('message: ' + e.message);
        });
        res.on('end', function() {
            response.render('post', { posts: results });
        });
    });

    httpsReq.write("{}");
    httpsReq.end();
});




app.listen(3000)

console.log('listening on port 3000')
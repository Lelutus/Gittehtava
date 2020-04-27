
// Asenna ensin express npm install express --save

var express = require('express');
var app = express();

var fs = require("fs");
let cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');
var customerController = require('./customerController');

const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3002;


//CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //  res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Staattiset filut
app.use(express.static('public'));


let users = {
    userName: "Testi",
    loginTime: Date.now(),
    sessionId: 1234
}
// REST API Asiakas
app.get('/', function (request, response) {
    var username = request.cookies['userData'];
    if (!username || users.sessionId !== 1234) {
        fs.readFile("login.html", function (err, data) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(data);
            response.end();
        });
    }
    else if (username && username.sessionId === 1234) {
        fs.readFile("OmaApiHaku.html", function (err, data) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(data);
            response.end();
        })
    }
});


app.get('/login', (req, res) => {
    res.cookie("userData", users);
    res.send("Keksi generoitu");

});

app.get('/getuser', (req, res) => {
    console.log(req.cookies);
    res.send(req.cookies)
});

app.get('/logout', (req, res) => {
    res.clearCookie("userData");
    res.send("Kayttaja poistettu")
});


    

app.route('/Asiakastyyppi')
    .get(customerController.fetchTyyppi);

app.route('/Asiakas')
    .get(customerController.fetchAll)
    .post(customerController.create)
    .put(customerController.update);

app.route('/Asiakas/:id')
    .get(customerController.fetch)
    //.put(customerController.update)
    .delete(customerController.poista);

// app.route('/Asiakas/get/:id')


// app.get('/', function(request, response){
//     response.statusCode = 200;
//     response.setHeader('Content-Type', 'text/plain');
//     response.end("Terve maailma"); 
// });

app.get('/maali', function (request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end("Maalit 2-3");
});


app.route('/task')
    .get(function (request, response) {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end("Taskeja pukkaa");
    })
    .post(function (request, response) {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end("Taskeja pukkaa persiistä");
    });

app.listen(port, hostname, () => {
    console.log(`Server running AT http://${hostname}:${port}/`);
});


// app.listen(port, () => {
//     console.log(`Server running AT http://${port}/`);
//});

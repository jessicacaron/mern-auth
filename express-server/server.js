const express = require("express");
var session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const app = express();

// this helps us so that the react server can talk with
// and utilize the same sessions as the express server

app.use(cors({
    origin : "http://localhost:3001", credentials: true
}));

app.use(bodyParser.json());

var store = new MongoDBStore({
    uri: 'mongodb+srv://jwspeedy82:164142378aA@cs3750.0uud5so.mongodb.net/employees?retryWrites=true&w=majority',
    databaseName: 'connect_mongodb_session_test',
    collection: 'my_sessions'
});

store.on('error', function(error){
    console.log("Error connecting to the session store: " + store);
});

app.use(session({
    secret: 'keyboard cat',
    cookie: {
        maxAge: 1000 * 60 *60 *24 *7 // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true
}));

//routes
app.get("/", (req, res) => res.send("Hello World!"));

app.post("/login", (req, res) => {
    console.log("In POST /Login");
    const username = req.body.username;
    const password = req.body.password;

    console.log("Username: " + username);
    console.log("Username: " + username);



    if(username === "bob"){
        //logged in
        req.session.username = username;
        req.session.loggedIn = true;
    } else {
        req.session.username = "";
        req.session.loggedIn = false;
    }
    req.session.save(function(err){
        if(err) {
            console.log("Error saving session.");
        } else {
            console.log("The session is now: " + JSON.stringify(req.session));
            //if the server saved everything correct, send loggedIn to user
            res.send(JSON.stringify({"loggedIn":req.session.loggedIn}));
        }
    });

});

app.listen(4000, () => {console.log("Running on http://localhost:4000")});
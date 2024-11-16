require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./config/passportConfig');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const connectionString = process.env.ATLAS_URI;
const port = process.env.PORT;

// Require routes
const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// Setup error handler
app.use(errorHandler);

// Setup session
app.use(session({secret: process.env.SECRET, resave: false, saveUninitialized: false}));

// Init Passport
app.use(passport.initialize());

// Use Passport to deal with session
app.use(passport.session())

// Connect to database
mongoose.connect(connectionString)
.then(() => console.log("Database connected"))
.catch((err) => console.log(err));

// Use routes
app.use('/', indexRoute, authRoute);

// Start the server
app.listen(port, () => console.log(`Nodejs Mini Message Board listening on port ${port}!`));
require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const connectionString = process.env.ATLAS_URI;
const port = process.env.PORT;

const indexRouter = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());

app.use('/', indexRouter);

const start = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(connectionString);
        app.listen(port, () => console.log(`Nodejs Mini Message Board listening on port ${port}`));
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
};

start();
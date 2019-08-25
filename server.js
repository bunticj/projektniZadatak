const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/route');
const logger = require('morgan');
const port = process.env.PORT || 3300;


 
//Authentication packages


const passport = require('passport');



app = express();

//Middlewares
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
/* Express-session sam uzalud ubacivao,jer necemo raditi autentikaciju preko cookiea,nego preko jwt
app.use(session({
    secret: 'somesecretthings',
    resave: false,
    saveUninitialized: false,
     //cookie: { secure: true }
}));
*/
app.use(passport.initialize());

//Routes
app.use(router);

//Entry point


//setting up the server
app.listen(port, () => console.log(`App listening on PORT ${port} .`));


module.exports = app;
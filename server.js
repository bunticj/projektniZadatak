const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/route');
const logger = require('morgan');
const port = process.env.PORT || 3300;
const passport = require('passport');
const cors = require('cors');
app = express();

//Middlewares
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors());

//Routes
app.use(router);

//Entry point
router.get('/', (req, res, next) => {
    res.send('Here is the home page. Please register or login to proceed...');
});

//setting up the server
app.listen(port, () => console.log(`App listening on PORT ${port} .`));


module.exports = app;

const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/route');
var port = process.env.PORT || 3300;



app = express();

//Middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(router);


//Entry point
router.get('/', (req, res, next) => {
    res.send('Here is the home page');
});


//setting up the server
app.listen(port, () => console.log(`App listening on PORT ${port} .`));


module.exports = app;
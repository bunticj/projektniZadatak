const express = require('express');
const router = express.Router();
const dbClass = require('../core/database');
const db = new dbClass();
const {
    check,
    validationResult
} = require('express-validator');
const passport = require('passport');
require('../passport')(passport);
const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../configuration/index');




function signToken(user_id) {

    return JWT.sign({
        sub: user_id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, JWT_SECRET);
}

//GET REQUESTS 

router.get('/', (req, res, next) => {

    res.send('Here is the home page');
});


router.get('/user', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    db.getUsers().then(resolve => res.send(JSON.stringify(resolve)));
});

router.get('/topic', (req, res, next) => {
    db.getTopicList().then(resolve => res.send(JSON.stringify(resolve)));
});

//GET by ID
router.get('/topic/:id', (req, res, next) => {
    let id = req.params.id;
    db.getSingleTopic(id).then(resolve => res.send(JSON.stringify(resolve)));
});

router.get('/user/:id', (req, res, next) => {
    let id = req.params.id;
    db.getSingleUser(id).then(resolve => res.send(JSON.stringify(resolve)));
});

//GET comments on topic with id : 
router.get('/topic/:id/comment', (req, res, next) => {
    let id = req.params.id;
    db.getCommentsOnTopic(id).then(resolve => res.send(JSON.stringify(resolve)));
});

//login
router.get('/login', (req, res, next) => {
    res.send('Here is the login page');
});

//register
router.get('/register', (req, res, next) => {
    res.send('Register');
});



//POST REQUESTS

//Add new topic and validate
router.post('/topic', [
    check('title')
    .not().isEmpty().withMessage('Title field is empty'),
    check('content')
    .not().isEmpty().withMessage('Content field is empty')
    //user_id tj, onaj tko je kreirao temu  moram  skontati kako, pa cu onda postaviti validaciju i za to 
], (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    let data = req.body;
    db.addTopic(data).then(resolve => res.send(JSON.stringify(resolve)));
});

//Add new user and validate
router.post('/register', [
    check('first_name')
    .not().isEmpty().withMessage('Field is empty')
    .isAlpha().withMessage('Must be alphabetical chars'),

    check('last_name')
    .not().isEmpty().withMessage('Field is empty')
    .isAlpha().withMessage('Must be alphabetical chars'),

    check('email')
    .not().isEmpty().withMessage('Field is empty')
    .isEmail().withMessage('Email is not valid')
    .custom((value) => {
        return db.getEmails(value).then(resolve => {
            //resolve.length baca broj istih emailova 
            if (resolve.length > 0) {
                throw new Error('Email address already in use');
            }
        });

    }),

    check('password')
    .not().isEmpty().withMessage('Field is empty')
    .isLength({
        min: 8
    }).withMessage('Password is required to have minimum 8 characters'),

    check('confirmPassword')
    .custom((value, { req }) => value === req.body.password).withMessage("Passwords don't match"),

    //Jel dovoljno samo provjeriti unos u body-u ,ako je false baci gresku,a da frontendas na taj true napravi strihir i polje itd
    check('termsOfService')
    .not().isEmpty().withMessage('Field is empty')
    .custom((value) => value === true).withMessage('Accept terms of service to registrate successfully')

], (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    var data = req.body;


    db.addUser(data).then(resolve => {
        user_id = resolve.insertId;
        const token = signToken(user_id);
        res.status(200).json({
            token
        });
    })
});


//Add new comment and validate
router.post('/topic/:id/comment', [
    check('comment_content')
    .not().isEmpty().withMessage('Field is empty')
    //user_id koji salje zahtjev,naci nacin za to,vjerojatno preko tokena

], (req, res, next) => {
    let param = req.params;
    let data = req.body;
    db.addComment(data, param).then(resolve => res.send(JSON.stringify(resolve)));
});



//PATCH REQUESTS
router.patch('/user/:id', (req, res, next) => {
    let id = req.params.id;
    let data = req.body;
    db.updateUser(data, id).then(resolve => res.send(JSON.stringify(resolve)));
});

router.patch('/topic/:id', (req, res, next) => {
    let id = req.params.id;
    let data = req.body;
    db.updateTopic(data, id).then(resolve => res.send(JSON.stringify(resolve)));
});

router.patch('/comment/:id', (req, res, next) => {
    let id = req.params.id;
    let data = req.body;
    db.updateComment(data, id).then(resolve => res.send(JSON.stringify(resolve)));
});


//DELETE REQUESTS
router.delete('/user/:id', (req, res, next) => {
    let id = req.params.id;
    db.removeUser(id).then(resolve => res.send(JSON.stringify(resolve)));
});

router.delete('/topic/:id', (req, res, next) => {
    let id = req.params.id;
    db.removeTopic(id).then(resolve => res.send(JSON.stringify(resolve)));
});

router.delete('/comment/:id', (req, res, next) => {
    let id = req.params.id;
    db.removeComment(id).then(resolve => res.send(JSON.stringify(resolve)));
});


passport.serializeUser((user_id, done) => {
    done(null, user_id);
});

passport.deserializeUser((user_id, done) => {
    done(null, user_id);

});


module.exports = router;
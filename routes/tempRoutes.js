/*const express = require('express');
const router = express.Router();
const dbClass = require('../core/database');
const db = new dbClass();
const {check,
    validationResult
} = require('express-validator');

//GET REQUESTS 

router.get('/user', (req, res, next) => {
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

router.get('/comment/:id', (req, res, next) => {
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

//Add new topic
router.post('/topic', [
    check('title')
    .not().isEmpty().withMessage('Title field is empty'),
    check('content')
    .not().isEmpty().withMessage('Content field is empty')
    //user_id tj, onaj tko je kreirao temu ce se automatski postaviti,to moram jos skontati kako pa cu onda postaviti validaciju i za to 
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

//Add new user
router.post('/register', [
    check('first_name')
    .not().isEmpty().withMessage('Field is empty')
    .isAlpha().withMessage('Must be alphabetical chars'),
    check('last_name')
    .not().isEmpty().withMessage('Field is empty')
    .isAlpha().withMessage('Must be alphabetical chars'),
    

    check('email')
    .not().isEmpty().withMessage('Field is empty')
    .isEmail().withMessage('Email is not valid'),
    

    check('password')
    .not().isEmpty().withMessage('Field is empty')
    .isLength({
        min: 8,
        max: 50
    }).withMessage('Password is required to have minimum 8 characters'),


], (req, res, next) => {
    let data = req.body;
    db.addUser(data).then(resolve => res.send(JSON.stringify(resolve)));
});

//Add new comment
router.post('/comment', (req, res, next) => {
    let data = req.body;
    db.addComment(data).then(resolve => res.send(JSON.stringify(resolve)));
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


*/
/*
    let errors = [];

    //Check required fields
    if (!(first_name || last_name || email || password || password2)) {
        errors.push({
            msg: 'Please fill in all fields'
        });
    }
    //Check password match
    if (password !== password2) {
        errors.push({
            msg: 'Passwords do not match'
        });
    }
    //Check pass length 
    if (password.length < 8) {
        errors.push({
            msg: ' Password should be at least 8 characters long'
        });
    }

    if (errors.length > 0) {
        res.redirect('/register');
    } else {
        res.send('Registrated');
    }


module.exports = router;*/
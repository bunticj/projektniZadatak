const express = require('express');
const router = express.Router();
const dbClass = require('../core/database');
const db = new dbClass();
const {
    check,
    validationResult
} = require('express-validator');
//Authorization
const passport = require('passport');
require('../passport')(passport);
const JWT = require('jsonwebtoken');
const {
    JWT_SECRET
} = require('../configuration/scrt');


function signToken(id) {

    return JWT.sign({
        sub: id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, JWT_SECRET);
}

//GET REQUESTS 

//register
router.get('/register', (req, res, next) => {
    res.send('Register');
});

//login
router.get('/login', (req, res, next) => {
    res.send('Log in to proceed');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/user', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    db.getUsers().then(resolve => res.send(JSON.stringify(resolve)));
});

router.get('/topic', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    db.getTopicList().then(resolve => res.send(JSON.stringify(resolve)));
});

//GET by ID
router.get('/topic/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    let id = req.params.id;

    db.getSingleTopic(id).then(resolve => res.send(JSON.stringify(resolve)));
});

router.get('/user/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    let id = req.params.id;
    db.getSingleUser(id).then(resolve => res.send(JSON.stringify(resolve)));
});

//GET comments on topic with id : 
router.get('/topic/:id/comment', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    let id = req.params.id;
    db.getCommentsOnTopic(id).then(resolve => res.send(JSON.stringify(resolve)));
});






//POST REQUESTS

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
        return db.getUserByEmail(value).then(resolve => {
            //resolve.length ->  number of users with this email
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
    .custom((value, {
        req
    }) => value === req.body.password).withMessage("Passwords don't match"),

    // termsOfService should be equal to true 
    check('termsOfService')
    .not().isEmpty().withMessage('Field is empty')
    .custom((value) => value === true).withMessage('Accept terms of service to registrate successfully')

], (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors);

        return res.status(400).json({
            errors: errors.array()
        })
    }


    //call addUser ,create token
    db.addUser(req.body).then(resolve => {
        user_id = resolve.insertId;
        const token = signToken(user_id);
        res.status(201).json({
            token,
            message: 'User created'
        });
    })
});


//login post 
router.post('/login', [
    check('email')
    .not().isEmpty().withMessage('Field is empty')
    .isEmail().withMessage('Email is not valid'),
    check('password')
    .not().isEmpty().withMessage('Field is empty')
    .isLength({
        min: 8
    }).withMessage('Password is required to have minimum 8 characters')
], passport.authenticate('local', {

    // successRedirect: '/topic',
    successMessage: 'Success',
    failureRedirect: '/login',
    session: false
}), (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({
            errors: errors.array()
        })
    }
    db.getUserByEmail(req.body.email).then(resolve => {
        const token = signToken(resolve[0].id);
        res.status(200).json({
            token,
            message: "Authentication successful"
        });
    });

});
//Add new topic and validate
router.post('/topic', passport.authenticate(('jwt'), {
    session: false
}), [
    check('title')
    .not().isEmpty().withMessage('Title field is empty'),
    check('content')
    .not().isEmpty().withMessage('Content field is empty')
], (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    db.addTopic(req.body, user.id).then(resolve => res.status(201).send(JSON.stringify(resolve)));
});



//Add new comment and validate
router.post('/topic/:id/comment', passport.authenticate(('jwt'), {
    session: false
}), [
    check('comment_content')
    .not().isEmpty().withMessage('Field is empty')

], (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    let id = req.params.id;

    db.addComment(req.body, id, user.id).then(resolve => res.status(201).send(JSON.stringify(resolve)));
});



//PATCH REQUESTS
router.patch('/user/:id',

    passport.authenticate(('jwt'), {
        session: false
    }), [
        check('first_name')
        .isAlpha().withMessage('Must be alphabetical chars'),

        check('last_name')
        .isAlpha().withMessage('Must be alphabetical chars'),
    ], (req, res, next) => {
        let id = parseInt(req.params.id);
        let parsedTokenId = parseInt(user.id);

        if (id === parsedTokenId) {
            db.updateUser(req.body, parsedTokenId).then(resolve => res.status(200).send(JSON.stringify(resolve)));
        } else {
            throw Error('Unauthorized');
        }

    });

//Doesn't get errors,but doesn't update anything!!! 
router.patch('/topic/:id', passport.authenticate(('jwt'), {
    session: false
}), (req, res, next) => {
    var parsedTokenId = parseInt(user.id);
    var parsedTopicId = parseInt(req.params.id);
    //console.log(parsedTokenId);

    db.getSingleTopic(req.params.id).then(resolve => {
        var topicObj = resolve[0];
        console.log(parsedTokenId);
        console.log(topicObj.user_id);
        if (topicObj.user_id === parsedTokenId) {
            //Log prodje,ali nista ne promijeni kada zovnem funkciju updateTopic
            console.log('Condition passed');
            //mozda je jer su oba promisa resolve pa se bunda,SUTRA PROBAT da nazovem neki drukcije 
            db.updateTopic(parsedTopicId).then(resolve => res.status(200).send(JSON.stringify(resolve)));
        } else {
            console.log('bad');
            throw Error('Unauthorized');

        }
    })

});

//Popraviti logiku
router.patch('/topic/:topicId/comment/:commentId', passport.authenticate(('jwt'), {
    session: false
}), (req, res, next) => {
    console.log(req.params);
    let topicId = req.params.topicId;
    let commentId = parseInt(req.params.commentId);
    let parsedTokenId = parseInt(user.id);


    db.updateComment(req.body, commentId).then(resolve => res.status(200).send(JSON.stringify(resolve)));
});


//DELETE REQUESTS
//Delete user
router.delete('/user/:id', passport.authenticate(('jwt'), {
    session: false
}), (req, res, next) => {
    let parsedId = parseInt(req.params.id);
    let parsedToken = parseInt(user.id)

    if (parsedId === parsedToken) {
        console.log(parsedId, parsedToken);
        db.removeUser(parsedId).then(resolve => res.status(200).send(JSON.stringify(resolve)));
    } else {
        console.log(parsedId, parsedToken);
        throw Error('Unauthorized');
    }
});

//add authorization and  logic
router.delete('/topic/:id', (req, res, next) => {
    let id = req.params.id;
    db.removeTopic(id).then(resolve => res.send(JSON.stringify(resolve)));
});

router.delete('/topic/:topicId/comment/:commentId', (req, res, next) => {
    let id = req.params.id;
    db.removeComment(id).then(resolve => res.send(JSON.stringify(resolve)));
});




module.exports = router;
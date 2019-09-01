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
const nodeMail = require('../configuration/mailService').nodeMail;


//ovu funkciju prebaciti negdje
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
    res.status(200).send('Register');
});

//login
router.get('/login', (req, res, next) => {
    res.status(200).send('Log in to proceed');
});

//logout
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


//forgot pass
router.get('/passwordreset', (req, res, next) => {
    res.status(200).send('Do you want to reset your password? ');
});


router.get('/user', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    db.getUsers().then(resolve => res.status(200).send(JSON.stringify(resolve)));
});

router.get('/topic', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    db.getTopicList().then(resolve => res.status(200).send(JSON.stringify(resolve)));
});

//GET by ID
router.get('/topic/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    let id = req.params.id;

    db.getSingleTopic(id).then(resolve => res.status(200).send(JSON.stringify(resolve)));
});

router.get('/user/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    let id = req.params.id;
    db.getSingleUser(id).then(resolve => res.status(200).send(JSON.stringify(resolve)));
});

//GET comments on topic with id : 
router.get('/topic/:id/comment', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    let id = req.params.id;
    db.getCommentsOnTopic(id).then(resolve => res.status(200).send(JSON.stringify(resolve)));
});






//POST REQUESTS

router.post('/passwordreset', (req, res, next) => {
  
    db.getUserByEmail(req.body.email)
    .then(resolve =>{
        if (resolve.length < 1){
            throw Error (`User doesn't exist`);
        }
        else {
            console.log( resolve[0]);
            var token = signToken(resolve[0].id);
            console.log(token,'token',req.headers.host,'host');
            nodeMail(resolve[0],req.headers.host,token);

        }}).catch(err => console.log(err));
       
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

], passport.authenticate('local', {
    successRedirect: '/topic',
    successMessage : 'Success',
    failureMessage : 'Wrong credentials',
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
        console.log(errors);
        return res.status(400).json({
            errors: errors.array()
        })
    }
    console.log()
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
        console.log(errors);
        return res.status(400).json({
            errors: errors.array()

        });
    }
    db.addComment(req.body, req.params.id, user.id).then(resolve => res.status(201).send(JSON.stringify(resolve)));
});



//PATCH REQUESTS
//Update user,validate 
router.patch('/user/:id', passport.authenticate(('jwt'), {
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

router.patch('/topic/:id', passport.authenticate(('jwt'), {
    session: false
}), (req, res, next) => {
    var parsedTokenId = parseInt(user.id);
    var parsedTopicId = parseInt(req.params.id);

    db.getSingleTopic(req.params.id).then(resolve => {
        var topicObj = resolve[0];
        if (topicObj.user_id === parsedTokenId) {
            console.log('Condition passed,user can update this topic');
            db.updateTopic(req.body, parsedTopicId).then(result => res.status(200).send(JSON.stringify(result)));
        } else {
            throw Error('Unauthorized');
        }
    })

});

router.patch('/topic/:topicId/comment/:commentId', passport.authenticate(('jwt'), {
    session: false
}), (req, res, next) => {
    var parsedTokenId = parseInt(user.id);
    var commentId = parseInt(req.params.commentId);
    db.getSingleComment(commentId).then(resolve => {
        var commentObj = resolve[0];
        if (commentObj.user_id === parsedTokenId) {
            console.log('User can update this comment');
            db.updateComment(req.body, req.params.commentId)
                .then(result => res.status(200).send(JSON.stringify(result)));
        } else {
            throw Error('Unauthorized');
        }
    })

});




//DELETE REQUESTS
//Delete user
router.delete('/user/:id', passport.authenticate(('jwt'), {
    session: false
}), (req, res, next) => {
    var parsedId = parseInt(req.params.id);
    var parsedToken = parseInt(user.id)

    if (parsedId === parsedToken) {
        console.log(parsedId, parsedToken);
        db.removeUser(parsedId).
        then(resolve => res.status(200).send(JSON.stringify(resolve)));
    } else {
        console.log(parsedId, parsedToken);
        throw Error('Unauthorized');
    }
});

router.delete('/topic/:id', passport.authenticate(('jwt'), {
    session: false
}), (req, res, next) => {
    var parsedTokenId = parseInt(user.id);

    db.getSingleTopic(req.params.id).then(resolve => {
        var topicObj = resolve[0];

        if (topicObj.user_id === parsedTokenId) {
            console.log('Condition passed,user can delete this topic');
            db.removeTopic(req.params.id).then(result => res.status(200).send(JSON.stringify(result)));
        } else {
            throw Error('Unauthorized');
        }
    })

});



router.delete('/topic/:topicId/comment/:commentId', passport.authenticate(('jwt'), {
    session: false
}), (req, res, next) => {

    var parsedTokenId = parseInt(user.id);
    var commentId = parseInt(req.params.commentId);
    db.getSingleComment(commentId).then(resolve => {
        var commentObj = resolve[0];
        if (commentObj.user_id === parsedTokenId) {
            console.log('User can delete this comment');
            db.removeComment(commentId).then(result => res.status(200).send(JSON.stringify(result)));
        } else {
            throw Error('Unauthorized');
        }
    })

});





module.exports = router;
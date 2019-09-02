const JWTStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { JWT_SECRET } = require('./configuration/scrt').jwt;
const dbClass = require('./core/database');
const db = new dbClass();
const bcrypt = require('bcryptjs');


module.exports = function (passport) {

    //JSON WEB TOKEN STRATEGY
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromHeader('authorization'),
        secretOrKey: JWT_SECRET
    }, async (payload, done) => {

        try {
            //find user by id
            await db.getSingleUser(payload.sub).then(resolve =>{
                user = resolve[0]; 
            });
            if (!user) {
                console.log('user u jwt strategiji ne postoji');
                return done(null, false);
            }
            done(null, {user});
        } catch (error) {
            done(error, false);
        }
    }));

    //LOCAL STRATEGY
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },  (email, password, done) => {
       
         db.getUserByEmail(email)
            .then(resolve => {
                if (resolve.length < 1) {
                    return done(null, false);

                } else {
                    const hash = resolve[0].password.toString();
                    const user = JSON.stringify(resolve[0]);
                     bcrypt.compare(password, hash,function(err,res){
                         if (res === true){
                            console.log('bcrypt pass compare is true');
                            console.log('Logged user is ' + user);

                            return done(null,  user);
                         }else{
                            console.log('Wrong password');
                            return done(null,false);
                         }
                     });
                       
                    
                   
                    


                }

            })

    }));

}
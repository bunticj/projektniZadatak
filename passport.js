const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt}  = require('passport-jwt');
const {JWT_SECRET} = require('./configuration/index');
const dbClass = require('./core/database');
const db = new dbClass();

module.exports = function(passport){
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromHeader('authorization'),
        secretOrKey: JWT_SECRET
    }, async (payload, done) => {
    
        try {
            const user = db.getSingleUser(payload.sub);
            console.log(user);
            if (!user) {
                return done(null, false);
            }
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    }));
}

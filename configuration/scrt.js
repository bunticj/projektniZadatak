const JWT = require('jsonwebtoken');

module.exports.jwt = {
    JWT_SECRET: 'thisissomeauthenticationstring'
};

module.exports.sendGrid = {
    SENDGRID_SECRET : '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'
};

module.exports.signToken = function signToken(id) {

    return JWT.sign({
        sub: id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, JWT_SECRET);
};
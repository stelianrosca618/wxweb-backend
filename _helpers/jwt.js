const expressJwt = require('express-jwt');
const config = require('config.json');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/wximgs/readImgfile',
            '/wximgs/readCam1Img',
            '/wximgs/readCam4Img',
            '/wximgs/readWeatherData',
            '/wximgs/readWeadtheTrends'
        ]
    });
}

async function isRevoked(req, payload, done) {
    done();
};
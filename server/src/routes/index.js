const auth = require('./auth');
const seller = require('./seller');
const buyer = require('./buyer');
const guest = require('./guest');
const { authenticationToken } = require('../middleware/authentication');

function routes(app) {
    app.use('/auth', auth);
    // app.use('/seller', authenticationToken, seller); // Protecting seller routes with authentication middleware
    // app.use('/buyer', authenticationToken, buyer); // Protecting buyer routes with authentication middleware
    app.use('/seller', seller);
    app.use('/buyer', buyer);
    app.use('/', guest);
    app.get('/test', (req, res) => {
        res.status(200).send('Test route is working');
    });

}

module.exports = routes;


var router = require('express').Router();

router.use('/sites', require('./sites/index.js'));

router.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Welcome to weather api');
});

module.exports = router;

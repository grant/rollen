var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('splash');
});

// TODO: fix later
router.get('/app', function(req, res) {
    res.render('app');
});

module.exports = router;

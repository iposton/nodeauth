var express = require('express');
var router = express.Router();

/* Members page  */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Members' });
});

function ensureAuthenticated(req, res, next) {
  if(!req.isAuthenticated()) {
              req.session.originalUrl = req.originalUrl;
    res.redirect('/users/login');
  } else {
    return next();
  }
}

module.exports = router;

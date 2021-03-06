var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var env = process.env.NODE_ENV || 'development';
if (env === 'production') {
  // mongoose connect for heroku
  var dbMonk = require('monk')(process.env.MONGOLAB_URI);
} else {
  var dbMonk = require('monk')('localhost/nodeauth');
}


/* Members page  */
router.get('/', ensureAuthenticated, function(req, res, next) {
	var dbMonk = req.dbMonk;
	var posts = dbMonk.get('posts');
	posts.find({}, {}, function(err, posts) {
		res.render('index', {
			"posts": posts,
			title: 'Members'
		});
	});
});

function ensureAuthenticated(req, res, next) {
	if (!req.isAuthenticated()) {
		req.session.originalUrl = req.originalUrl;
		res.redirect('/users/login');
	} else {
		return next();
	}
}

module.exports = router;
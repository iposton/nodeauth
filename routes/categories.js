var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var dbMonk = require('monk')('localhost/nodeauth');

router.get('/show/:category', function(req, res, next) {
	var dbMonk = req.dbMonk;
	var posts = dbMonk.get('posts');
	posts.find({
		category: req.params.category
	}, {}, function(err, posts) {
		res.render('index', {
			"title": req.params.category,
			"posts": posts
		});
	});
});

router.get('/add', function(req, res, next) {
	res.render('addcategory', {
		"title": "Add Category"
	});
});

router.post('/add', function(req, res, next) {
	// Get Form Values
	var title = req.body.title;

	// Form Validation
	req.checkBody('title', 'Title field is required').notEmpty();

	// Check Errors
	var errors = req.validationErrors();

	if (errors) {
		res.render('addcategory', {
			"errors": errors,
			"title": title
		});
	} else {
		var categories = dbMonk.get('categories');

		// Submit to DB
		categories.insert({
			"title": title
		}, function(err, category) {
			if (err) {
				res.send('There was an issue submitting the category');
			} else {
				req.flash('success', 'Category Submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;
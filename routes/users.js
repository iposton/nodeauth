var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null,'./public/images/uploads');
	}, 
	filename: function (req, file, cb) { 
		cb(null, file.fieldname + '-' + Date.now() + '.png');
	}
}); 
var upload = multer({ storage: storage}).single('mainimage');

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{
  	'title': 'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login',{
  	'title': 'Login'
  });
});


router.post('/register', function(req, res, next) {
	var name = req.body.name;
	var email = req.body.email;
	var username  = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;



//Check for image field
if(req.body.profileimage) {
	console.log('Uploading file...');

  // file info
	var profileImageOriginalName 	= req.body.profileimage.originalname;
	var profileImageName         	= req.body.profileimage.name;
	var profileImageMime         	= req.body.profileimage.mimetype;
	var profileImagePath         	= req.body.profileimage.path;
	var profileImageExt        	= req.body.profileimage.extension;
	var profileImageSize         	= req.body.profileimage.size;

} else {
	//Set a default image 
	var profileImageName = 'noimage.png';

}

// Form Validation 
req.checkBody('name', 'Name field is required').notEmpty(); 
req.checkBody('email', 'Email field is required').notEmpty(); 
req.checkBody('email', 'Email is not valid').isEmail(); 
req.checkBody('username', 'Username field is required').notEmpty(); 
req.checkBody('password', 'Password field is required').notEmpty(); 
req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

//Check for errors 
var errors = req.validationErrors();

if(errors) {
	res.render('register', {
		errors: errors,
		name: name,
		email: email,
		username: username,
		password: password,
		password2: password2
	});
} else {
		var newUser = new User({
			name: name,
		  email: email,
		  username: username,
		  password: password,
		  profileimage: profileImageName
		});

		// Create User
		User.createUser(newUser, function(err, user) {
			if(err) throw err;
			console.log(user);
		});

		//Success message 
		req.flash('success', 'You are now registered and may log in now.');

		res.location('/');
		res.redirect('/');
}

});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
	function(username, password, done){
		User.getUserByUsername(username, function(err, user){
			if(err) throw err;
			if(!user){
				console.log('Unknown User');
				return done(null, false,{message: 'Unknown User'});
			}

			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				} else {
					console.log('Invalid Password');
					return done(null, false, {message:'Invalid Password'});
				}
			});
		});
	}
));

router.post('/login', passport.authenticate('local',{failureRedirect:'/users/login', failureFlash:'Invalid username or password'}), function(req, res){
	console.log('Authentication Successful');
	req.flash('success', 'You are logged in.');
	res.redirect('/');
});

router.get('/logout', function(req, res) {
	req.logout();
	console.log('you have logged out...');
	req.flash('success', 'You have logged out.');
	res.redirect('/users/login');

});
module.exports = router;

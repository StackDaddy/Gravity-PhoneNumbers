//Require the User model to make calls to DB
var User = require('./models/user.js');

// expose this function to our app using module.exports
module.exports = function(app, passport) {

  // =====================================
  // HOME PAGE (with login) ========
  // =====================================
  app.get('/', function(req, res) {
    res.render('index.ejs', { message: req.flash('loginMessage') }); // load the index.ejs file
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

    // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));


  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));


  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  //====DATABASE Routing
  //Upload a new phone list
  app.post('/phoneListUpload', function(req, res) {

    //Declare information
    var userIdentification = req.user._id;
    var data = req.body;
    var phoneGroupAmount = data.length
    var phoneGroupDate = Date.now();

    //Create Database Object
    var phoneSet = {
      amount: phoneGroupAmount,
      date: phoneGroupDate,
      list: data
    };

    User.update({ _id: userIdentification}, {$push: { uploads : phoneSet }}, function(err, data) {
          if (err) { console.log(err) }
          res.json("success")
      });
  })


  //Retreive all phone lists
  app.get('/phoneList', function(req, res) {
    var userIdentification = req.user._id;
    User.find({_id: userIdentification}).exec(
      function (err, data) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(data);
    })
  })



//end of module
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

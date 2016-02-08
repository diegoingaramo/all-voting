var express = require('express');

/* token service */
var token_service = require('../service/token_service.js');

var User = require('../model/user'); // get our mongoose model

var router = express.Router();

/* GET users listing. */
router.post('/signup', function(req, res) {
    
    // find the user
    User.findOne({email: req.body.email}, function(err, user) {
        
        if (err) throw err;

        if (!user) {
    
            var user = new User({
                email: req.body.email,
                password: req.body.password
            });

            user.save(function(err){
                return res
                    .status(200)
                    .send({success: true, token: token_service.createToken(user)});
            });
            
        }else {
             res.json({ success: false, message: 'User exists.' });
        }
    });
    
});


// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/login', function(req, res) {

  // find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = token_service.createToken(user);

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
});


// route to return all users (GET http://localhost:8080/users/list)
router.get('/list', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
}); 

module.exports = router;

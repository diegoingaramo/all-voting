var express = require('express');

var Poll = require('../model/poll'); // get our mongoose model
var User = require('../model/user'); // get our mongoose model

/* token service */
var token_service = require('../service/token_service.js');


var router = express.Router();

/* GET users listing. */
router.post('/getPollsByUser', token_service.isAuthenticated, function(req, res) {
    
    if (!req.body.email){
        res.json({ success: false, message: 'Poll is missing.' });
    } else{
        
        // find the user
        User.find({email: req.body.email}, function(err, user) {

            if (err) throw err;

            if (!user) {
                    
                res.json({ success: false, message: 'User doesn\'t exist.' });

            }else {
                 //search for user's polls
                 Poll.find({owner:user._id},function(err, polls) {
                     
                     if (err) throw err;
                     
                     res
                        .status(200)
                        .send({success: true, polls: polls});
                 });
            }
        });
        
    }
});


module.exports = router;

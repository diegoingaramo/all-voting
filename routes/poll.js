var express = require('express');

var Poll = require('../model/poll'); // get our mongoose model
var User = require('../model/user'); // get our mongoose model

/* token service */
var token_service = require('../service/token_service.js');


var router = express.Router();

/* POST users listing. */
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
                 Poll.find({owner:user._id},'question',function(err, polls) {
                     
                     if (err) throw err;
                     
                     res
                        .status(200)
                        .send({success: true, polls: polls});
                 });
            }
        });
        
    }
});


/* POST users listing. */
router.post('/search', function(req, res) {
    
    var searchText = req.body.searchtext;
    var searchTextRegEx = new RegExp(".*" + searchText + ".*","gi");
    
    //search for user's polls
    //Poll.find({question:{ $regex: searchTextRegEx, $options: 'gi' }},function(err, polls) {
    Poll.find({question:{$regex: searchTextRegEx}},function(err, polls) {
    //Poll.find({question:{ $regex: /.*how.*/, $options: 'gi' }},function(err, polls) {
                     
    if (err) throw err;
                     
    res
        .status(200)
        .send({success: true, polls: polls});
    });
    
});


/* POST users listing. */
router.post('/new', token_service.isAuthenticated, function(req, res) {
    
    // find the user
    User.find({email: req.body.email}, function(err, user) {

            if (err) throw err;

            if (!user) {
                    
                res.json({ success: false, message: 'User doesn\'t exist.' });
            }
        
            var poll = new Poll({
                owner: user._id,
                question: req.body.question,
                options: req.body.options
            });
    
            poll.save(function(err){
                if (err) throw err;
                return res
                        .status(200)
                        .send({success: true});
            });
              
    });
    
});


module.exports = router;

var express = require('express');

var User = require('../model/user'); // get our mongoose model
var Poll = require('../model/poll'); // get our mongoose model

/* token service */
var token_service = require('../service/token_service.js');


var router = express.Router();

/* POST users listing. */
router.post('/getPollsByUser', token_service.isAuthenticated, function(req, res) {
    
    if (!req.body.email){
        res.json({ success: false, message: 'Poll is missing.' });
    } else{
        
        // find the user
        User.findOne({email: req.body.email}, function(err, user) {

            if (err) throw err;

            if (!user) {
                    
                res.json({ success: false, message: 'User doesn\'t exist.' });

            }else {
                 //search for user's polls
                 //console.log(user);
                 Poll.find({ownerEmail:user.email}, 'question ownerEmail', function(err, polls) {
                     
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
    Poll.find({question:{$regex: searchTextRegEx}}, 'question ownerEmail', function(err, polls) {
                     
        if (err) throw err;
        
        res
            .status(200)
            .send({success: true, polls: polls});
    });
    
});


/* POST users listing. */
router.post('/getByID', function(req, res) {
    
    var pollID = req.body.pollID;
    
     //search for user's polls
     Poll.findOne({_id: pollID}, function(err, poll) {
                     
         if (err) throw err;
                     
        res
            .status(200)
            .send({success: true, poll: poll});
     });
});

/* POST vote poll. */
router.post('/vote', function(req, res) {
    
    var pollID = req.body.pollID;
    var optionID = req.body.optionID;
    var newOptionText = req.body.newOptionText;
    
    //update existing option
    if (optionID != 0){
        
        Poll.update({ "options._id": optionID }, {$inc : {"options.$.votes" : 1}},
                 
            function(err) {

                if (err) throw err;

                res
                    .status(200)
                    .send({success: true});

         });
        
    }else{
        
        //add new poll option
        Poll.findOne({_id: pollID}, function(err, poll) {
                     
            if (err) throw err;

            // create a comment
            poll.options.push({ description: newOptionText, votes: 1 });

            poll.save(function (err) {
                if (err) return handleError(err);
                return res
                        .status(200)
                        .send({success: true});
            });
            
        });
        
    }
    
    
});

/* POST users listing. */
router.post('/new', token_service.isAuthenticated, function(req, res) {
    
    // find the user
    User.findOne({email: req.body.email}, function(err, user) {

            if (err) throw err;

            if (!user) {
                    
                res.json({ success: false, message: 'User doesn\'t exist.' });
            }

            var poll = new Poll({
                ownerEmail: user.email,
                question: req.body.question,
                options: req.body.options
            });
        
            console.log(poll);
    
            poll.save(function(err,poll){
                
                if (err) throw err;
                
                return res
                    .status(200)
                    .send({success: true});

            });
              
    });
    
});


/* POST users listing. */
router.post('/remove', token_service.isAuthenticated, function(req, res) {
    
    Poll.find({_id:req.body.pollID,ownerEmail:req.body.email}).remove(function(err,poll){
                
                if (err) throw err;
                
                return res
                    .status(200)
                    .send({success: true});

    }); 
    
});



module.exports = router;
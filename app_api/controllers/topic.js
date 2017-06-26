var mongoose = require('mongoose');
var Topic = mongoose.model('Topic');

module.exports.topic = function(req, res) {

  //Search in Database tournament data
  console.log("Here");
  Topic.find({}, "lasteditiondate generalinfo claninfo", 
    function(err, docs){console.log("Boum" + err);})
  .exec(function(err, result) {
        console.log("Result" + JSON.stringify(result));
        res.status(200).json(result[0]);
      });
  };
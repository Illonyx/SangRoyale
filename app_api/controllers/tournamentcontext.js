var mongoose = require('mongoose');
var TournamentContext = mongoose.model('TournamentContext');

module.exports.tournamentcontext = function(req, res) {

  //Search in Database tournament data
  TournamentContext.find({}, "id generalinfo current_round doodles", 
    function(err, docs){console.log("Boum" + err);})
  .exec(function(err, result) {
        console.log("Result" + JSON.stringify(result));
        res.status(200).json(result[0]);
      });
  };
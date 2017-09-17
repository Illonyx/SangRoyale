var mongoose = require('mongoose');
var TournamentContext = mongoose.model('TournamentContext');

module.exports.tournamentcontext = function(req, res) {

  //Search in Database tournament data
  TournamentContext.find({}, "name description date reglement privacy organizer capacity tournamentGemProperty tournamentChallongeProperty", 
    function(err, docs){console.log("Boum" + err);})
  .exec(function(err, result) {
        console.log("Result" + JSON.stringify(result));
        res.status(200).json(result);
      });
  };
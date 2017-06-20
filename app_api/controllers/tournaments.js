var mongoose = require('mongoose');
var Tournament = mongoose.model('Tournament');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var filterObjectTableWithKeys = function(tabContent, objCategory, objectKeysToConsider){
    return tabContent.map(function(object){

      var revivedObject = object[objCategory];
      var newObj = {};
        objectKeysToConsider.map(function(keyToConsider){
          newObj[keyToConsider] = revivedObject[keyToConsider];
      });
        return newObj;
    });
  };

module.exports.tournaments = function(req, res) {

  //Search in Database tournament data
  console.log("Here");
  Tournament.find({}, "tournament.name tournament.url tournament.full_challonge_url tournament.tournament_type tournament.participants_count", 
    function(err, docs){console.log("Boum" + err);})
  .exec(function(err, result) {
        console.log("Result" + JSON.stringify(result));
        res.status(200).json(result);
      });
  };
  
/*
  challongeResults = filterObjectTableWithKeys(challongeResults, "tournament", ["id", "name", "url", "tournament_type", "completed_at", "full_challonge_url", "participants_count"]);
  
  Fonctions à remettre en état : 

//--------------------------------------------------------------------------------
// Specific challonge functions
//--------------------------------------------------------------------------------

function findUserTournamentId(user, tournamentParticipants){
  for(var i=0;i<tournamentParticipants.length;i++){
    var participant = tournamentParticipants[i].participant;
    //The easiest case
    if(user.challonge_username === participant.challonge_username){
      return participant.id;
    }
  }
  return null;
};

function findUserInfo(userId, tournamentParticipants){
  for(var i=0;i<tournamentParticipants.length;i++){
    var participant = tournamentParticipants[i].participant;

    if(userId === participant.id){
      return participant.name;
    }
  }
}

function findUserMatches(userId, matches){
  var userMatches = new Array();
  for(var i=0;i<matches.length;i++){
    var match = matches[i].match;
    //The easiest case
    if(userId === match.player1_id || userId === match.player2_id){
      userMatches.push(match);
    }
  }
  return userMatches;
}


*/




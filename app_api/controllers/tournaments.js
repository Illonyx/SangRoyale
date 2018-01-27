const challonge = require('challonge')
const client = challonge.createClient({
  apiKey: process.env.CHALLONGE_USER_TOKEN
});

//Faut bien convertir ce format tout pourri avant de faire autre chose :D
var convert = function(challongeJson, objectKey){
  var array = []
  for(var i=0;i<Object.keys(challongeJson).length;i++){
    var tournamentJson = challongeJson["" + i][objectKey]
    if(tournamentJson)
      array.push(tournamentJson)
  }
  console.log('First elem : ' + JSON.stringify(array[0]))
  return array
}

module.exports.tournaments = function(req, res){
  client.tournaments.index({
    callback: (err, data) => {
    //console.log(err, data);
    //Converts data object in a readable arraylist
    var array = convert(data, "tournament")
    var arrayM = array.map(function(tournament){
      return {
        name : tournament.name,
        url : tournament.url,
        full_challonge_url : tournament.fullChallongeUrl,
        tournament_type : tournament.tournamentType,
        participants_count : tournament.participantsCount
      }
    })
    console.log('Array' + JSON.stringify(arrayM))
    res.status(200).json(arrayM);
    }
});

}
  
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




(function() {

  angular
    .module('sangRoyaleApp')
    .service('tournaments', tournaments);

  tournaments.$inject = ['$http'];
  function tournaments($http) {

    var getTournaments = function () {
      return $http.get('/api/tournaments');
    };

    return {
      getTournaments : getTournaments
    };
  }

})();

/* A refactoriser

//------------------------------------------------------------------------------
  // Get challonge tournament result for a user
  //------------------------------------------------------------------------------

  //--Conversion en service à priori-- dependra d'un User setté dans une factory
  function getTournamentsResultsForUser(tournamentResultsService){
    
    var scope = this;
    var user={name:'Skyice',challonge_username:'Skyice7', challongeId:''};
    var tournamentsPlayerResults = new Array();

    //L'utilisateur a participé?
    var tournamentResults = tournamentResultsService.getTournamentResults();

    for(var tournamentIndex = 0; tournamentIndex<tournamentResults.length;tournamentIndex++){
      var tournamentResult = tournamentResults[tournamentIndex].tournament;
      var participants = tournamentResult.participants;
      var userTournamentId = findUserTournamentId(user, participants);

      if(userTournamentId != null){
        tournamentResult["isParticipant"] = true;
        var userInfo = findUserInfo(userTournamentId, participants);
        var userMatches = findUserMatches(userTournamentId, tournamentResult.matches);

        //Fill found matches with participant data
        for(var i=0;i<userMatches.length;i++){
          if(userTournamentId != userMatches[i].player1_id){
            var opponentInfo = findUserInfo(userMatches[i].player1_id, participants);
            userMatches[i]["username"] = userInfo;
            userMatches[i]["opponent"] = opponentInfo;
          } else if(userTournamentId != userMatches[i].player2_id){
            var opponentInfo = findUserInfo(userMatches[i].player2_id, participants);
            userMatches[i]["username"] = userInfo;
            userMatches[i]["opponent"] = opponentInfo;
          } else {
            console.log('Problem?');
          }
        }
        tournamentResult["userMatches"] = userMatches;
      }
      else{
        tournamentResult["isParticipant"] = false;
        tournamentResult["userMatches"] = new Array();
      }
    }

    var tournamentsResultsForUser = filterObjectTableWithKeys(tournamentResults, "tournament", ["id", "name", "url", "tournament_type", "completed_at", "full_challonge_url", "participants_count", "userMatches", "isParticipant"]);
    console.log('fff' + JSON.stringify(tournamentsResultsForUser));
    this.tournamentsResultsForUser = tournamentsResultsForUser;
  };

  */
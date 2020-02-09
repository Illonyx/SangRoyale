const request = require('request-promise')
const crApiSecretKey = process.env.CR_API_SECRET_KEY
const _ = require('lodash');


/*
-- Gettlers (Network)
*/

var getRequest = function(urlExtension, queryStrings) {
  console.log('Requête RoyaleAPI lancée à : ' + urlExtension)
  var options = {
    'method' : 'GET',
    'uri': 'https://api.clashroyale.com/v1/' + urlExtension, 
    'headers': { 
      'User-Agent' : 'Sang Royale Website',
      'Authorization': 'Bearer ' + crApiSecretKey
    },
    'json' : true 
  };
  if(queryStrings) options["qs"] = queryStrings;
  return request(options)
}

//--ROUTES

var getPlayer = function(playerId){
  return getRequest("player/" + playerId)
}

var getClan = function(clanId){
  return getRequest('clans/' + "%23" + clanId)
}

module.exports.getClanWarLog = function(clanId){
  return getRequest('clans/' + "%23" + clanId + "/warlog")
}

module.exports.getClan = function(clanId){
  return getClan(clanId)
}

module.exports.getPlayer = function(req, res){
  var playerId = req.params.id
  return getPlayer(playerId).then(function(data){
    res.status(200).json(data)
  })
}

module.exports.consumeApi = function(req, res){
  console.log("dd");
  var clanId = "%23" + req.params.id;
  return getRequest("clans/" + clanId).then(function(data){
    //console.log('Données récup OK' + JSON.stringify(data));
   
    
    
    res.status(200).json(data);
  }).catch(function(error){
    res.status(500).send("Probleme de récupération des données, erreur : " + error)
  });
}


var formatPlayerResult = function(played, nbBattles, wins){
  var result = ""
  if(played != nbBattles) {
    result = "NF";
  } else {
    for(var i=0;i<played;i++){
      if(i<wins) result += "W"
      else result += "L"
    }
  }
  return result
}

var formatWarResult = function(standings, clanId){
  var warResult = {}
  var trophyChange;

  //1. Find clan standing
  var clanStanding = standings.find(function(participatingClan){
    if(participatingClan.clan.tag == clanId) trophyChange = participatingClan.trophyChange;
    return participatingClan.clan.tag == clanId;
  })
  warResult['standing'] = (standings.indexOf(clanStanding) + 1) + "e pl - " + clanStanding.clan.clanScore + "(" + trophyChange +")"
  warResult['battleStat'] = clanStanding.clan.wins + "/" + clanStanding.clan.participants + '(' + clanStanding.clan.crowns +' cr)'

  return warResult

}



module.exports.parseClanWarLog = function(clanId, data) {
 
    var allParticipants = [];
    var renderParams = [];

    //Tous les participants existants
    data.items.forEach(function(clanwar){
      
      //Parser la date de merde en un format ISO 8601
      var splittedDate = clanwar.createdDate.split("T")[0];
      var splittedTime = clanwar.createdDate.split("T")[1];

      var dateToParse = splittedDate.substring(0,4) + "-" + splittedDate.substring(4,6) + "-" + splittedDate.substring(6,8) + "T";
      dateToParse += splittedTime.substring(0,2) + ":" + splittedTime.substring(2,4) + ":" + splittedTime.substring(4);

      var warEndTime = new Date(dateToParse);
      var date = warEndTime.getDate() + "-" + (warEndTime.getMonth()+1) + "-" + warEndTime.getFullYear();

      var warResult = formatWarResult(clanwar.standings, '#' + clanId);

      //Put it in render params object
      renderParams.push({
        warEndTime : warEndTime.getTime(),
        cardsEarnedLabel : "cardsEarned-" + date,
        finalResultLabel : "finalResult-" + date,
        standingStat : warResult.standing,
        battleStat : warResult.battleStat
      })

      //Browse all participants in different clan wars and add them
      clanwar.participants.forEach(cwparticipant => {
        var participantFound = _.find(allParticipants, participant => participant.tag == cwparticipant.tag);
        if(!participantFound){
          participantFound = {"name" : cwparticipant.name, "tag" : cwparticipant.tag}
          allParticipants.push(participantFound);
        }
        participantFound["cardsEarned-"+ date] = cwparticipant.cardsEarned
        participantFound["finalResult-" + date] = formatPlayerResult(cwparticipant.battlesPlayed, cwparticipant.numberOfBattles, cwparticipant.wins)
        
        var indexToUpdate = allParticipants.indexOf(participantFound)
        if(indexToUpdate != -1) allParticipants[indexToUpdate] = participantFound
      });
    })

    //Feed all data
    allParticipants.forEach(function(participant){
      renderParams.forEach(function(renderParam){
        if( !participant[renderParam.cardsEarnedLabel] && !participant[renderParam.finalResultLabel] ) {
          participant[renderParam.cardsEarnedLabel] = "NP";
          participant[renderParam.finalResultLabel] = "NP";
        }
      })
    })

    return {
      renderParams : renderParams,
      participants : allParticipants
    };
}

module.exports.playersStats = function(playerIds){
  var playersInUrl = ""
  for(var i=0;i<playerIds.length;i++){
    if(i>0){
      playersInUrl += ","
    }
    playersInUrl += playerIds[i]
  }
  return getPlayer(playersInUrl)
}






const request = require('request-promise')
const crApiSecretKey = process.env.CR_API_SECRET_KEY


/*
-- Gettlers (Network)
*/

var get = function(extension){
  console.log('Requête RoyaleAPI lancée à : ' + extension)
  var options = {
    'method' : 'GET',
    'uri': 'https://api.royaleapi.com/' + extension, 
    //Add query strings - code à refactorer
    // 'qs' : {
    //   type: 'war'
    // },
    'headers': { 
      'User-Agent' : 'Sang Royale Website',
      'auth': crApiSecretKey
    },
    'json' : true 
  };
  return request(options)
}

//--ROUTES

var getPlayer = function(playerId){
  return get("player/" + playerId)
}

var getClan = function(clanId){
  return get('clan/' + clanId)
}

var getClanBattles = function(clanId){
  return get("clan/" + clanId + "/battles");
}

module.exports.getClanWarLog = function(clanId){
  return get('clan/' + clanId + "/warlog")
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
  var clanId = req.params.id;
  return getClanBattles(clanId).then(function(data){
    console.log('Données récup OK' + JSON.stringify(data));
    //data = data.filter(function(battle){
    //  return battle.type == "war";
    //})
   
    
    
    res.status(200).send(data);
  }).catch(function(error){
    res.status(500).send("Probleme de récupération des données, erreur : " + error)
  });
}


var formatPlayerResult = function(played,wins){
  if(played == 0) return "NF"
  var result = ""
  for(var i=0;i<played;i++){
    if(i<wins) result += "W"
    else result += "L"
  }
  return result

}

var formatWarResult = function(standings, clanId){
  var warResult = {}

  //1. Find clan standing
  var clanStanding = standings.find(function(participatingClan){
    return participatingClan.tag == clanId
  })
  warResult['standing'] = (standings.indexOf(clanStanding) + 1) + "e pl - " + clanStanding.warTrophies + "(" + clanStanding.warTrophiesChange +")"
  warResult['battleStat'] = clanStanding.wins + "/" + clanStanding.participants + '(' + clanStanding.crowns +' cr)'

  return warResult

}



module.exports.parseClanWarLog = function(clanId, data) {
 
    var allParticipants = [];
    var renderParams = [];

    //Tous les participants existants
    data.forEach(function(clanwar){
      
      //Get war end time
      var warEndTime = new Date(Date.parse(clanwar.warEndTime));
      var date = warEndTime.getDate() + "-" + (warEndTime.getMonth()+1) + "-" + warEndTime.getFullYear();

      var warResult = formatWarResult(clanwar.standings, clanId);

      //Put it in render params object
      renderParams.push({
        warEndTime : warEndTime.getTime(),
        cardsEarnedLabel : "cardsEarned-" + date,
        finalResultLabel : "finalResult-" + date,
        standingStat : warResult.standing,
        battleStat : warResult.battleStat
      })

      //Browse all participants in different clan wars and add them
      for(var i=0;i<clanwar.participants.length;i++){
        
        var participantFound = allParticipants.find(function(participant){
          return clanwar.participants[i].tag == participant.tag;
        })
        if(!participantFound){
          participantFound = {"name" : clanwar.participants[i].name, "tag" : clanwar.participants[i].tag}
          allParticipants.push(participantFound);
        }
        participantFound["cardsEarned-"+ date] = clanwar.participants[i].cardsEarned
        participantFound["finalResult-" + date] = formatPlayerResult(clanwar.participants[i].battlesPlayed, clanwar.participants[i].wins)
        
        var indexToUpdate = allParticipants.indexOf(participantFound)
        if(indexToUpdate != -1) allParticipants[indexToUpdate] = participantFound
      }
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






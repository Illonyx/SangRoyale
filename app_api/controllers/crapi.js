const request = require('request-promise')
const crApiSecretKey = process.env.CR_API_SECRET_KEY


/*
-- Gettlers (Network)
*/

var get = function(extension){
  console.log('uri' + extension)
  var options = {
    'method' : 'GET',
    'uri': 'http://api.royaleapi.com/' + extension, 
    'headers': { 
      'User-Agent' : 'Sang Royale Website',
      'auth': crApiSecretKey
    },
    'json' : true 
  };
  //console.log('uri' + uri)
  return request(options)
}


var getClan = function(clanId){
  return get('clan/' + clanId)
}

module.exports.getClanWarLog = function(clanId){
  return get('clan/' + clanId + "/warlog")
}

module.exports.getSRFamily = function(){
  return get('clan/family/sr/clans')
}

var getPlayer = function(playerId){
  return get("player/" + playerId)
}

module.exports.getClan = function(clanId){
  return getClan(clanId)
}

module.exports.getPlayer = function(req, res){
  var playerId = req.params.id
  getPlayer(playerId).then(function(data){
    res.status(200).json(data)
  })
}

var formatPlayerResult = function(played,wins){
  if(played == 0) return "NP"
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

module.exports.apiClanWarLog = function(req, res){
  var clanId = req.params.id
  get('clan/' + clanId + "/warlog").then(function(data){
    console.log('Données récup OK')
    var allParticipants = [];
    var referentialObject = {"name":"Toutes Guerres", "tag" : "/"}

    //Tous les participants existants
    data.forEach(function(clanwar){
      
      //Put good date in string
      var createdDate = new Date(parseInt(clanwar.createdDate)*1000);
      var date = createdDate.getDate() + "-" + (createdDate.getMonth()+1) + "-" + createdDate.getFullYear();
      var warResult = formatWarResult(clanwar.standings, clanId)
      referentialObject["cardsEarned-" + date] = warResult.standing
      referentialObject["finalResult-" + date] = warResult.battleStat

      for(var i=0;i<clanwar.participants.length;i++){
        
        var participantFound = allParticipants.find(function(participant){
          return clanwar.participants[i].name == participant.name;
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

    //Sort participants if they are here in the clan

    allParticipants.unshift(referentialObject)

    
    res.status(200).send(allParticipants)
  }).catch(function(error){
    res.status(500).send("Probleme de récupération des données")
  });
}

module.exports.parseClanWarLog = function(clanId, data) {
 
    var allParticipants = [];
    var referentialObject = {"name":"Toutes Guerres", "tag" : "/"}

    //Sort by ascending created date
    console.log("API Data" + JSON.stringify(data));

    data.sort(function(clanwar1, clanwar2){
      return clanwar1.createdDate - clanwar2.createdDate;
    })


    //Tous les participants existants
    data.forEach(function(clanwar){
      
      //Put good date in string
      var createdDate = new Date(parseInt(clanwar.createdDate)*1000);
      var date = createdDate.getDate() + "-" + (createdDate.getMonth()+1) + "-" + createdDate.getFullYear();
      var warResult = formatWarResult(clanwar.standings, clanId)
      referentialObject["cardsEarned-" + date] = warResult.standing
      referentialObject["finalResult-" + date] = warResult.battleStat

      for(var i=0;i<clanwar.participants.length;i++){
        
        var participantFound = allParticipants.find(function(participant){
          return clanwar.participants[i].name == participant.name;
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

    //Sort participants if they are here in the clan
    allParticipants.unshift(referentialObject)
    return allParticipants
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




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

module.exports.apiClanWarLog = function(req, res){
  var clanId = req.params.id
  getClanWarLog(clanId).then(function(data){
    console.log('OK')
    var allParticipants = [];
    //Tous les participants existants
    data.forEach(function(clanwar){
      
      //Put good date in string
      var createdDate = new Date(parseInt(clanwar.createdDate)*1000);
      var date = createdDate.getDate() + "-" + createdDate.getMonth() + "-" + createdDate.getFullYear();

      for(var i=0;i<clanwar.participants.length;i++){
        
        var participantFound = allParticipants.find(function(participant){
          return clanwar.participants[i].name == participant.name;
        })
        if(!participantFound){
          participantFound = {"name" : clanwar.participants[i].name, "tag" : clanwar.participants[i].tag}
          allParticipants.push(participantFound);
        }
        participantFound["cardsEarned-"+ date] = clanwar.participants[i].cardsEarned
        participantFound["finalResult" + date] = formatPlayerResult(clanwar.participants[i].battlesPlayed, clanwar.participants[i].wins)
        
        var indexToUpdate = allParticipants.indexOf(participantFound)
        if(indexToUpdate != -1) allParticipants[indexToUpdate] = participantFound
      }


    })




    res.status(200).send(data)
  }).catch(function(error){
    res.status(500).send("Probleme de récupération des données")
  });
}

module.exports.membersClanChestCrowns = function(req, res) {

  //Download the necessary data using cr.js client

  var clanId = req.params.id
  console.log("Processing with clanId : " + clanId)
  getClan(clanId).then(function(data){
  	console.log("Data" + JSON.stringify(data))
  	var name=data.name;
  	var members=data.members;
  	var members = members.map(function(member){
  		return {"name":member.name, "clanChestCrowns":Number(member.clanChestCrowns)}
  	})
  	members.sort(function(a,b){
  		return a.clanChestCrowns - b.clanChestCrowns
  	})

  	res.status(200).json({"name":name,"members":members});

  }).catch(function(error){
  	res.status(500).send("Probleme de récupération des données")
  });
  	
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




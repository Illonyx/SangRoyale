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

var getClanWarlog = function(clanId){
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

module.exports.apiClanWarLog = function(req, res){
  var clanId = req.params.id
  getClanWarlog(clanId).then(function(data){
    console.log('OK')
    res.status(200).json(data)
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




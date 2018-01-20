const request = require('request-promise')
const crApiSecretKey = process.env.CR_API_SECRET_KEY


/*
-- Gettlers (Network)
*/

var get = function(extension){
  console.log('uri' + extension)
  var options = {
    'method' : 'GET',
    'uri': 'http://api.cr-api.com/' + extension, 
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

var getPlayer = function(playerId){
  return get("player/" + playerId)
}

module.exports.clanchest = function(req, res) {

  //Download the necessary data using cr.js client

  var clanId = req.params.id
  console.log("Processing with clanId : " + clanId)
  getClan(clanId).then(function(data){
  	console.log("Data" + JSON.stringify(data))
  	var name = data.name;
  	var result = data.clanChest.crowns;
  	var percent = data.clanChest.percent;
    var status = data.clanChest.status;
  	res.status(200).json({"name":name,"result":Number(result),"percent":percent, "status":status});

  }).catch(function(error){
    console.log('What' + error)
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
  		return {"name":member.name, "clanChestCrowns":Number(member.clanChestCrowns), "roleName": member.roleName}
  	})
  	members.sort(function(a,b){
  		return a.clanChestCrowns - b.clanChestCrowns
  	})

  	res.status(200).json({"name":name,"members":members});

  }).catch(function(error){
  	res.status(500).send("Probleme de récupéation des données")
  });
  	
 }

module.exports.clanChestCrowns = function(clanId){
  return getClan(clanId)
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




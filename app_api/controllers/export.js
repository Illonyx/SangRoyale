var json2xls = require('json2xls');
var fs = require('fs')
var path = require('path')

var ctrlCrApi = require('./crapi')

var sangRoyaleFamily = [
    {"name":"Sang Royale", "id":"CJQLP2"}, 
    {"name":"Sang Royale II", "id":"2LUU0R0L"}, 
    {"name":"Sang Royale III", "id":"8CPG2YU"}, 
    {"name":"Sang Royale IV", "id":"8GQL980P"}, 
    {"name":"Sang Royale V", "id":"8VVGJPCR"}]

var formatPlayerResult = function(played,wins){
  if(played == 0) return "NP"
  var result = ""
  for(var i=0;i<played;i++){
    if(i<wins) result += "W"
    else result += "L"
  }
  return result

}

module.exports.generateGdcReport = function(req,res) {
	var clanId=req.params.id
	console.log("Activity generation demand received")
	var allParticipants = []
	
	var jsonResult = ctrlCrApi.getClanWarLog(clanId).then(function(data){
	    
	 	allParticipants = ctrlCrApi.parseClanWarLog(clanId, data)
		return ctrlCrApi.getClan(clanId)

	}).then(function(clanResult){
		console.log("ClanResult :" + JSON.stringify(allParticipants))
		var allParticipantsInClan = []
		var allParticipantsOut = []
		var AllWars = {}
		for(var i = 0; i<allParticipants.length;i++){
			var isInClan = clanResult.members.find(function(member){
				return member.tag==allParticipants[i].tag
			})
			console.log("Is in clan?" + isInClan)
			
			if(isInClan) allParticipantsInClan.push(allParticipants[i])
			else if (allParticipants[i].tag == "/") AllWars = allParticipants[i]
			else allParticipantsOut.push(allParticipants[i])
		}
		allParticipantsInClan.sort(function(a,b){

	      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
     	  else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      	  return 0;
	    })
	    console.log("allPIn" + JSON.stringify(allParticipantsInClan))
	    allParticipantsInClan.unshift(AllWars)
	    allParticipantsInClan = allParticipantsInClan.concat(allParticipantsOut)
	    res.status(200).json(allParticipantsInClan);

	})
	.catch(function(error){
    	console.log("Error Generate Activity Report : " + error)
    	res.status(503).json({"status" : error, "reason" : error})
  	});
   
}

module.exports.generateTrophyReport = function(req,res){
	var nameRequested=req.params.id
	//res.status(200).send("OK")
	console.log("Aqui?")
	ctrlCrApi.getClan(nameRequested)
	.then(function(data){
		var members=data.members
		var memberTags = members.map(function(member){
			return member.tag
		})
		console.log("Fin de traitement")
		return ctrlCrApi.playersStats(memberTags)
	}).then(function(playerdata){
		
		var playerDataMapped = playerdata.map(function(player){
			return {"name": player.name, "tag": player.tag, "trophies" : player.trophies, "record" : player.stats.maxTrophies, "wardaywins" : player.games.warDayWins, "wardaycollected" : player.stats.clanCardsCollected,
				 "previousSeason" : (player.leagueStatistics) ? (player.leagueStatistics.previousSeason) ? player.leagueStatistics.previousSeason.bestTrophies : "" : "", "challengeCardsWon" : player.stats.challengeCardsWon}
		})
		playerDataMapped.sort(function(a,b){
			if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
     		else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      		return 0;
		})
		console.log("We are jeree")
		res.status(200).json(playerDataMapped);

	}).catch(function(error){
		console.log("Erreur generateTrophyReport" + JSON.stringify(error))
    	res.status(503).json({"status" : error, "reason" : error})
  	});
}

/*

ANCIENNE METHODE : A REPRENDRE PLUS TARD DANS TROPHY

module.exports.downloadActivityReport = function(req, res){
	
	//Extract clan acronym
	var clanId = req.params.id
	var clanToFind = sangRoyaleFamily.find(function(clan){
		return (clanId == clan.id)
	})
	var clanAcronym = findClanAcronym(clanToFind.name)

	//Find good file
	var fileName = clanAcronym + "-activity.xls"
	var appDir = path.dirname(require.main.filename);
	var filePath = path.join(appDir, 'download', fileName)
	res.download(filePath, fileName)
}

module.exports.generateActivityReport = function(req,res) {
	var nameRequested=req.params.id
	res.status(200).write("Received")
	var clanAcronym=""
	console.log("Start bull job")
	
		var jsonResult = ctrlCrApi.getClan(nameRequested)
	.then(function(data){
	    console.log("Data" + JSON.stringify(data))
	    clanAcronym=findClanAcronym(data.name);
	    console.log("clan" + clanAcronym)
	    var members=data.members;
	    var membersA = members.map(function(member){
	      return {"name":member.name, "couronnes":Number(member.clanChestCrowns), "grade": member.role, "dons-faits" : member.donations, "dons-reçus" : member.donationsReceived }
	    })
	    membersA.sort(function(a,b){

	      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
     	  else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      	  return 0;
	    })

		var xls = json2xls(membersA)
		exportExcel(xls, clanAcronym + "-activity.xls")
		console.log('Job fini')
		res.status(200).send("OK")

	})
	.catch(function(error){
    	console.log("Error" + error)
  	});
   
}





*/
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
	console.log("GDC report generation!")
	
	var parseResult = {}
	
	return ctrlCrApi.getClanWarLog(clanId).then(function(data){
	    
		parseResult = ctrlCrApi.parseClanWarLog(clanId, data)
		return ctrlCrApi.getClan(clanId)

	}).then(function(clanResult){
		var allParticipants = parseResult.participants;
		console.log("ClanResult :" + JSON.stringify(allParticipants))
		var allParticipantsInClan = []
		var allParticipantsOut = []
		for(var i = 0; i<allParticipants.length;i++){
			var isInClan = clanResult.members.find(function(member){
				return member.tag==allParticipants[i].tag
			})
			console.log("Is in clan?" + isInClan)
			
			if(isInClan) allParticipantsInClan.push(allParticipants[i])
			else allParticipantsOut.push(allParticipants[i])
		}
		allParticipantsInClan.sort(function(a,b){

	      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
     	  else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      	  return 0;
	    })
	    console.log("allPIn" + JSON.stringify(allParticipantsInClan))
			allParticipantsInClan = allParticipantsInClan.concat(allParticipantsOut)
			
			parseResult.participants=allParticipantsInClan;
	    return res.status(200).json(parseResult);

	})
	.catch(function(error){
    	console.log("Error Generate Activity Report : " + error)
    	return res.status(503).json({"status" : error, "reason" : error})
  	});
   
}

module.exports.generateTrophyReport = function(req,res){
	var nameRequested=req.params.id;
	var members = [];
	console.log("Trophy report generation");

	return ctrlCrApi.getClan(nameRequested)
	.then(function(data){
		members=data.members
		var memberTags = members.map(function(member){
			return member.tag
		})
		console.log("Fin de traitement")
		return ctrlCrApi.playersStats(memberTags)
	}).then(function(playerdata){
		
		var playerDataMapped = playerdata.map(function(player){

			var member = members.find(function(smember){
				return player.tag == smember.tag;
			})

			return {"name": player.name, "tag": player.tag, "role": member.role, "expLevel" : member.expLevel, "donations" : member.donations, "donationsReceived" : member.donationsReceived, "trophies" : player.trophies, "record" : player.stats.maxTrophies, "wardaywins" : player.games.warDayWins, "wardaycollected" : player.stats.clanCardsCollected,
				 "previousSeason" : (player.leagueStatistics) ? (player.leagueStatistics.previousSeason) ? player.leagueStatistics.previousSeason.bestTrophies : "" : "", "challengeCardsWon" : player.stats.challengeCardsWon}
		})

		playerDataMapped.sort(function(a,b){
			if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
     	else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      		return 0;
		})
		
		return res.status(200).json(playerDataMapped);

	}).catch(function(error){
		console.log("Erreur generateTrophyReport" + JSON.stringify(error))
    return res.status(503).json({"status" : error, "reason" : error})
  	});
}
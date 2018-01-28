var json2xls = require('json2xls');
var fs = require('fs')
var path = require('path')

var ctrlCrApi = require('./crapi')

var findClanAcronym = function(clanName){
	var acronym = ""
	clanName = clanName.replace(/ +/g, "");
	for(var i=0;i<clanName.length;i++){
		var character = clanName[i]
		if(character == character.toUpperCase()){
			acronym += character
		}
	}
	return acronym.toLowerCase()
}

var exportExcel = function(xls, fileName, res){
	console.log('What')
	var appDir = path.dirname(require.main.filename);
	var filePath = path.join(appDir, 'test', 'jsonTesta.xls')
	console.log(filePath)
	fs.writeFile(filePath, xls, "binary", function(err) {
		if(err) {
    		return console.log(err);
		}
		console.log("The file was saved!");
		res.download(filePath, fileName)
	});
}

module.exports.downloadActivityReport = function(req,res) {
	var nameRequested=req.params.id
	var clanAcronym=""
	console.log('?')
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
		exportExcel(xls, clanAcronym + "-activity.xls", res)

	})
	.catch(function(error){
    	console.log("Error" + error)
  	});
   
}

module.exports.downloadTrophyReport = function(req,res){
	var nameRequested=req.params.id
	var clanAcronym=""
	console.log("Aqui?")
	ctrlCrApi.getClan(nameRequested)
	.then(function(data){
		clanAcronym=findClanAcronym(data.name);
		var members=data.members
		var memberTags = members.map(function(member){
			return member.tag
		})
		console.log("Fin de traitement")
		return ctrlCrApi.playersStats(memberTags)
	}).then(function(playerdata){
		
		var playerDataMapped = playerdata.map(function(player){
			return {"name": player.name, "tag": player.tag, "trophies" : player.trophies, "record" : player.stats.maxTrophies, 
				 "previousSeason" : (player.leagueStatistics) ? (player.leagueStatistics.previousSeason) ? player.leagueStatistics.previousSeason.bestTrophies : "" : "", "challengeCardsWon" : player.stats.challengeCardsWon}
		})
		playerDataMapped.sort(function(a,b){
			if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
     		else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      		return 0;
		})
		var xls = json2xls(playerDataMapped)
		exportExcel(xls, clanAcronym + "-trophy.xls", res)

	}).catch(function(error){
    	console.log("Error" + error)
  	});
}
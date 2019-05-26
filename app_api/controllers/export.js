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

var exportExcel = function(xls, fileName){
	console.log('What')
	var appDir = path.dirname(require.main.filename);
	var filePath = path.join(appDir, 'download', fileName)
	console.log(filePath)
	fs.writeFile(filePath, xls, "binary", function(err) {
		if(err) {
    		return console.log(err);
		}
		console.log("The file was saved!");
		//res.download(filePath, fileName)
	});
}

function findLastModificationDate(path){
	return new Promise(function(resolve, reject){
		fs.stat(path, function(err,stats){
			if(err) reject("Une erreur est survenue")
			else resolve(stats.mtime)
		})
	})
}


function promiseForClan(clan){
	var appDir = path.dirname(require.main.filename);
	var dataToSend = []
	return new Promise(function(resolve, reject){
		var clanAcronym = findClanAcronym(clan.name)
		var activityFile = path.join(appDir, 'download', clanAcronym + "-activity.xls")
		var trophyFile = path.join(appDir, 'download', clanAcronym + "-trophy.xls")

		findLastModificationDate(activityFile).then(function(result){
			dataToSend.push({"id":clan.id,"file":"activity","mdate":result})
			return findLastModificationDate(trophyFile)
		}).then(function(result){
			dataToSend.push({"id":clan.id,"file":"trophies","mdate":result})
			resolve(dataToSend)
		})

	})
}

module.exports.fileCheck = function(req, res){
	//Extract clan acronym
	
	var results = []
	sangRoyaleFamily.reduce(
		(promise,clan) =>
			promise.then( _ => promiseForClan(clan).then(function(result){
				console.log(JSON.stringify(result) + "Jouer1")
				results=results.concat(result)
			})),
		Promise.resolve()
	).then(function(done){
		var reorganisedResults = []
		sangRoyaleFamily.forEach(function(clan){
			var allExportsForId = results.filter(function(arrElt){
				return clan.id == arrElt.id
			})
			var result = {}
			result["id"]=clan.id
			allExportsForId.forEach(function(exportForId){
				result["mdate_"+ exportForId.file] = exportForId.mdate
			});
			console.log(JSON.stringify(result))
			reorganisedResults.push(result)
		});
		console.log("Reorg res" + reorganisedResults);
		res.status(200).json(reorganisedResults)
	})
	
}

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

var formatPlayerResult = function(played,wins){
  if(played == 0) return "NP"
  var result = ""
  for(var i=0;i<played;i++){
    if(i<wins) result += "W"
    else result += "L"
  }
  return result

}

module.exports.generateActivityReport = function(req,res) {
	var clanId=req.params.id
	console.log("Activity generation demand received")
	var clanToFind = sangRoyaleFamily.find(function(clan){
		return (clanId == clan.id)
	})
	var clanAcronym = findClanAcronym(clanToFind.name)
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
	    return allParticipantsInClan;

	    var xls = json2xls(allParticipantsInClan)
		exportExcel(xls, clanAcronym + "-activity.xls")
		console.log('Job fini')
		//res.status(200).send("OK")




	})
	.catch(function(error){
    	console.log("Error" + error)
  	});
   
}

module.exports.downloadTrophyReport = function(req, res){
	//Extract clan acronym
	var clanId = req.params.id
	var clanToFind = sangRoyaleFamily.find(function(clan){
		return (clanId == clan.id)
	})
	var clanAcronym = findClanAcronym(clanToFind.name)

	//Find good file
	var fileName = clanAcronym + "-trophy.xls"
	var appDir = path.dirname(require.main.filename);
	var filePath = path.join(appDir, 'download', fileName)
	res.download(filePath, fileName)
}

module.exports.generateTrophyReport = function(req,res){
	var nameRequested=req.params.id
	//res.status(200).send("OK")
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
		//var xls = json2xls(playerDataMapped)
		//exportExcel(xls, clanAcronym + "-trophy.xls")

	}).catch(function(error){
    	console.log("Error" + error)
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
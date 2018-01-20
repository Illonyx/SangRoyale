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

module.exports.downloadActivityReport = function(req,res) {
	var nameRequested=req.params.id
	var clanAcronym=""
	var jsonResult = ctrlCrApi.clanChestCrowns(nameRequested)
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

	    console.log("?")
		var xls = json2xls(membersA)

		var appDir = path.dirname(require.main.filename);
		var filePath = path.join(appDir, 'test', 'jsonTesta.xls')
		fs.writeFile(filePath, xls, "binary", function(err) {
			if(err) {
	    		return console.log(err);
			}
			console.log("The file was saved!");
			res.download(filePath, clanAcronym + "-activity.xls")
		});

	})
	.catch(function(error){
    	console.log("Error" + error)
  	});
   
}
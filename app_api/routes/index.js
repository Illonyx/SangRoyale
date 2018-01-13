var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var json2xls = require('json2xls');
var fs = require('fs')
var path = require('path')
var auth = jwt({
  secret: process.env.SR_SECRET_KEY,
  userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var ctrlTournaments = require('../controllers/tournaments');
var ctrlAbout = require('../controllers/topic');
var ctrlTournamentContext = require('../controllers/tournamentcontext');
var ctrlCrApi =require("../controllers/crapi")

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//Tournaments
router.get('/tournaments', ctrlTournaments.tournaments);

//CrApi
router.get('/crownchests/:id', ctrlCrApi.clanchest)
router.get('/membersClanChestCrowns/:id', ctrlCrApi.membersClanChestCrowns)

//About
router.get('/about',ctrlAbout.topic);

//TournamentContext
router.get('/tournamentcontext', ctrlTournamentContext.tournamentcontext)
router.get('/tournamentcontext/:id', ctrlTournamentContext.tournamentcontext)
router.post('/tournamentcontext', ctrlTournamentContext.create_event);

router.get('/download/:id', function(req,res) {
	var nameRequested=req.params.id
	if(req.params.id){
		console.log('youpi')
	} else {
		console.log('méheu')
	}
	var jsonResult = ctrlCrApi.clanChestCrowns(nameRequested)
	.then(function(data){
	    console.log("Data" + JSON.stringify(data))
	    var name=data.name;
	    var members=data.members;
	    var membersA = members.map(function(member){
	      return {"name":member.name, "clanChestCrowns":Number(member.clanChestCrowns), "roleName": member.role}
	    })
	    membersA.sort(function(a,b){
	      return a.clanChestCrowns - b.clanChestCrowns
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
			res.download(filePath, "sr.xls")
		});

	})
	.catch(function(error){
    	console.log("Error" + error)
  	});

	
		
    
    	 


   
}); 


	
	
	
	//res.download(__dirname + '/images/banniereCSnoir.png')

module.exports = router;

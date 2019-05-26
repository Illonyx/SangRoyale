var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
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
var ctrlExport = require("../controllers/export")
var ctrlCrApi = require("../controllers/crapi")
//var ctrlRssFeed = require("../utils/rssfeed")

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//Tournaments
router.get('/tournaments', ctrlTournaments.tournaments);

//CrApi
router.get('/player/:id', ctrlCrApi.getPlayer)
router.get('/clanwarlog/:id', ctrlCrApi.apiClanWarLog)

//About
router.get('/about',ctrlAbout.topic);

//TournamentContext
router.get('/tournamentcontext', ctrlTournamentContext.tournamentcontext)
router.get('/tournamentcontext/:id', ctrlTournamentContext.tournamentcontext)
router.post('/tournamentcontext', ctrlTournamentContext.create_event);
router.delete('/tournamentcontext/:id', ctrlTournamentContext.delete_event);

//Export
router.get('/generate/gdc/:id', ctrlExport.generateGdcReport); 
router.get('/generate/trophy/:id', ctrlExport.generateTrophyReport); 

//Rss feeds
//router.get('/rss', ctrlRssFeed.feed)


	


module.exports = router;

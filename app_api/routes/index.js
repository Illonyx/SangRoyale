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
var ctrlExport = require("../controllers/export")
var ctrlCrApi = require("../controllers/crapi")
var ctrlRssFeed = require("../controllers/rssfeed")

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//Tournaments
router.get('/tournaments', ctrlTournaments.tournaments);

//CrApi
router.get('/membersClanChestCrowns/:id', ctrlCrApi.membersClanChestCrowns)

//About
router.get('/about',ctrlAbout.topic);

//TournamentContext
router.get('/tournamentcontext', ctrlTournamentContext.tournamentcontext)
router.get('/tournamentcontext/:id', ctrlTournamentContext.tournamentcontext)
router.post('/tournamentcontext', ctrlTournamentContext.create_event);
router.delete('/tournamentcontext/:id', ctrlTournamentContext.delete_event);

//Export
router.get('/download/activity/:id', ctrlExport.downloadActivityReport); 
router.get('/download/trophy/:id', ctrlExport.downloadTrophyReport); 

//Rss feeds
router.get('/rss', ctrlRssFeed.feed)


	


module.exports = router;

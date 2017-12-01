var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
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

module.exports = router;

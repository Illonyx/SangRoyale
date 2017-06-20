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

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//Tournaments
router.get('/tournaments', ctrlTournaments.tournaments);

//About
router.get('/about',ctrlAbout.topic);

module.exports = router;

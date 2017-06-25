var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var topicSchema = new mongoose.Schema({
	lasteditiondate : String,
	lastsaison : String,
	tournoischallongeorganises : String,
	linkderniertournoi : String,
	linkchallongesangroyaletr : String,
	discordmembers : String,
	nombretrmaxSR : String,
	topicLinkJV : String,
	topicLinkCrFR : String,
	urlBaseImageTops : String,
  	claninfo: [{
  	name : String,
  	id : String,
  	description : String,
	membersNumber : String,
	requiredTrophies : String,
	currentScoreClan : String,
	bestScoreClan : String,
	nombre4kFinSaison : String,
	imageTop5 : String,
	availablePlaces : String
}]
});

mongoose.model('Topic', topicSchema, "topic");
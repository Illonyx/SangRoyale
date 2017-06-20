var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var topicSchema = new mongoose.Schema({
	lasteditiondate : String,
  	claninfo: [{
  	name : String,
  	id : String,
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
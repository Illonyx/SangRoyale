var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var tournamentContextSchema = new mongoose.Schema({
	
	id : String,
	generalinfo : Object,
	current_round : Number,
	doodles : [{
		round : Number,
		link : String
	}]
	
});

/*

{
		challongeurl : String,
  		gamemode : String,
  		rules : String,
  		type : String,
		restrictions : String,
		recompenses : String,
		tournamentmanagers : String,
		ruleswebsite : String
	}
*/

mongoose.model('TournamentContext', tournamentContextSchema, "tournamentContext");
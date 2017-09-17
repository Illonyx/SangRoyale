var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var tournamentContextSchema = new mongoose.Schema({
	
	name : String,
    description : String,
    date : String, 
    reglement : String,
    privacy : String,
    organizer : String,
    capacity : {type : Number, require : false},
    tournamentGemProperty : {

        type: {
        	password : String, 
        	gemnumber : Number
        },
        require : false

    },
    tournamentChallongeProperty : {
    	
    	type :  {
    		code : String,
        	url : String,
        	type : String,
        	eliminationMode : String,
        	gamemode : String, 
        	isFromLeague : String,
        	rewards : Object,
        	time : {
				endRegisterDate : String,
        		phase1Date : String
        	}

    	}, 
    	require : false
    }
    
	
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
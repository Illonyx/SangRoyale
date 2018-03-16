var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var tournamentContextSchema = new mongoose.Schema({
	
	id : String, 
    name : String,
    description : String,
    date : String, 
    reglement : String,
    privacy : String,
    organizer : String,
    capacity : {type : Number, require : false},
    kind : String, 
    league : {type : String, require : false},
    properties : Object, 
    alerts : [{
        id : String,
        date : String, 
        description : String
    }]
	
});

mongoose.model('TournamentContext', tournamentContextSchema, "tournamentContext");
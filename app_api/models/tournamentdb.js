var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var tournamentSchema = new mongoose.Schema({
  tournament : Schema.Types.Mixed
});

mongoose.model('Tournament', tournamentSchema, "tournamentdb");
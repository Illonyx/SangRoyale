var mongoose = require('mongoose');
var TournamentContext = mongoose.model('TournamentContext');

module.exports.tournamentcontext = function(req, res) {

if(req.params.id){
  //Search in Database tournament data
  console.log("here")
  TournamentContext.find({"id":req.params.id}, 
    function(err, docs){console.log("Boum" + err);})
  .exec(function(err, result) {
        console.log("Result" + JSON.stringify(result));
        res.status(200).json(result);
      });
} else {

  //Search in Database tournament data
  TournamentContext.find({}, "id name description date reglement privacy organizer capacity tournamentGemProperty tournamentChallongeProperty", 
    function(err, docs){console.log("Boum" + err);})
  .exec(function(err, result) {
        console.log("Result" + JSON.stringify(result));
        res.status(200).json(result);
      });
}

  };


  module.exports.create_event = function (req, res){
  	var event = new TournamentContext()
  	var reqBody  = req.body
  	console.log("Body " + JSON.stringify(req.headers))

  	//Parse into event
  	event.id=reqBody.id
  	event.name=reqBody.name
  	event.description=reqBody.description
  	event.date=reqBody.date
  	event.reglement=reqBody.reglement
  	event.privacy=reqBody.privacy
  	event.organizer=reqBody.organizer
  	event.capacity=reqBody.capacity 


  	if(reqBody.tournamentGemProperty){
  		var tournamentGemProperty = {}
  		tournamentGemProperty.gemnumber=reqBody.tournamentGemProperty.gemnumber
  		tournamentGemProperty.password=reqBody.tournamentGemProperty.password
  		event.tournamentGemProperty=tournamentGemProperty
  	} else {
  		console.log("Not managed")
  	}

  	event.save(function(err){
  		res.status(200).send("OK");
  	})

  };


  
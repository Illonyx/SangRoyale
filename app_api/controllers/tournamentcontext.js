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
  TournamentContext.find({}, "id name description date reglement privacy organizer capacity kind properties league", 
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
    event.kind=reqBody.kind
    event.properties=reqBody.properties
    event.league=reqBody.league

  	event.save(function(err){
  		res.status(200).send("OK");
  	})

  };

  module.exports.delete_event = function(req, res){
    TournamentContext.findByIdAndRemove(req.params.id, (err, todo) => {
       var response = {
        message: "Todo successfully deleted",
        id: todo.id
    };
    res.status(200).send(response);
    })
  };


  
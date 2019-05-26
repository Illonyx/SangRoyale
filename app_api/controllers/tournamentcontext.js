var mongoose = require('mongoose');
var TournamentContext = mongoose.model('TournamentContext');

//var RssFeed = require('../utils/rssfeed')
var cronManager = require('../utils/cron-manager')

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
  TournamentContext.find({}, "id name description date reglement privacy organizer capacity kind properties league alerts", 
    function(err, docs){console.log("Boum" + err);})
  .exec(function(err, result) {
        console.log("Result" + JSON.stringify(result));
        res.status(200).json(result);
      });
}

  };


module.exports.findalerts = function(){
  var allEventAlerts = []
  TournamentContext.find({}, "id alerts", function(err, docs){console.log("Hmmm")}).exec(function(err,result){
    allEventAlerts=result
    console.log('Résultat Find Alerts' + JSON.stringify(allEventAlerts))

    cronManager.initializeJobs(allEventAlerts)
    
  })
  
}

  module.exports.create_event = function (req, res){
  	var event = new TournamentContext()
  	var reqBody  = req.body
  	console.log("Body Requete Create Event" + JSON.stringify(req.body))

    //Create unique identifier for tournament
    var now = new Date()
    var id = "TR" + now.getDate() + now.getMonth() + now.getFullYear() + now.getHours() + now.getMinutes() + now.getSeconds();


  	//Parse into event
  	event.id=id
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
    event.alerts=reqBody.alerts
    console.log('Avant la sauvegarde' + JSON.stringify(event))

    //RssFeed.addItem(event)

  	event.save(function(err){
      console.log("Pb lors de la sauvegarde : " + err)
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


  
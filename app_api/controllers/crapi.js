const cr = require('cr.js');
let client = new cr.Client();

module.exports.clanchest = function(req, res) {

  //Download the necessary data using cr.js client

  console.log("Body" + JSON.stringify(req.body))
  var clanId = req.params.id
  console.log("Processing with clanId : " + clanId)
  client.getClan(clanId).then(function(data){
  	var name = data.name;
  	var result = data.clanChest.crowns;
  	var percent = data.clanChest.percent;
  	res.status(200).json({"name":name,"result":Number(result),"percent":percent});

  });
  	
 }
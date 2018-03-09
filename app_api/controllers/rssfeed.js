const Feed = require('feed');
let feed = new Feed({
  title: 'Fil d actu de Sang Royale',
  description: 'Ce flux contient tous les évènements organisés par la famille de clans Sang Royale',
  id: 'http://www.sangroyale.fr/',
  link: 'http://www.sangroyale.fr/',
  copyright: 'All rights reserved 2018, Alexis Mathey',
  updated: new Date(), // optional, default = today
  generator: 'awesome', // optional, default = 'Feed for Node.js'
  author: {
    name: 'Skyice',
    email: 'vespade@gmail.com',
    link: 'http://www.sangroyale.fr/'
  }
})

module.exports.feed = function(req, res){

	console.log("Explose3")
	res.set('Content-Type', 'text/xml');
	res.send(feed.rss2())
}



module.exports.addItem = function(event){
	feed.addItem({
		title : event.name,
		description : "Un évènement SR",
		date: new Date(), 
		guid : "http://www.sangroyale.fr/event/" + event.id
	})
}
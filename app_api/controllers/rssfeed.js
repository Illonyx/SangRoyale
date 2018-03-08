const Feed = require('feed');
let feed = new Feed({
  title: 'Feed Title',
  description: 'This is my personal feed!',
  id: 'http://example.com/',
  link: 'http://example.com/',
  image: 'http://example.com/image.png',
  favicon: 'http://example.com/favicon.ico',
  copyright: 'All rights reserved 2013, John Doe',
  updated: new Date(2013, 06, 14), // optional, default = today
  generator: 'awesome', // optional, default = 'Feed for Node.js'
  feedLinks: {
    json: 'https://example.com/json',
    atom: 'https://example.com/atom',
  },
  author: {
    name: 'John Doe',
    email: 'johndoe@example.com',
    link: 'https://example.com/johndoe'
  }
})

module.exports.feed = function(req, res){

	console.log("Explose3")
	res.set('Content-Type', 'text/xml');
	res.send(feed.atom1())
}



module.exports.addItem = function(event){
	feed.addItem({
		title : event.name,
		description : "Un évènement SR",
		id : "http://www.sangroyale.fr/event/" + event.id, 
		date: new Date(2013, 06, 14)
	})
}
const Feed = require('feed');
const feed = new Feed({
	    title:          'My Feed Title',
	    description:    'This is my personnal feed!',
	    link:           'http://example.com/',
	    image:          'http://example.com/logo.png',
	    copyright:      'Copyright © 2013 John Doe. All rights reserved',
	    id: 'http://www.sangroyale.fr/',

	    author: {
	        name:       'John Doe',
	        email:      'john.doe@example.com',
	        link:       'https://example.com/john-doe'
	    }
	});

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
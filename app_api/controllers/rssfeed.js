const Feed = require('feed');
const feed = new Feed({
	    title:          'My Feed Title',
	    description:    'This is my personnal feed!',
	    link:           'http://example.com/',
	    image:          'http://example.com/logo.png',
	    copyright:      'Copyright © 2013 John Doe. All rights reserved',

	    author: {
	        name:       'John Doe',
	        email:      'john.doe@example.com',
	        link:       'https://example.com/john-doe'
	    }
	});

module.exports.feed = function(req, res){

	console.log("Explose3")
	res.set('Content-Type', 'text/xml');
	res.send(feed.rss2())
}



module.exports.addItem = function(event){
	feed.addItem({
		title : event.name,
		id: "http://www.sangroyale.fr",
		link:"http://www.sangroyale.fr",
		description : "Un évènement SR",
	})
}
const CronJobManager = require('cron-job-manager');
const RssFeed = require('./rssfeed')

function dateToCron(date){
	var cronSchedule = ""
	cronSchedule += date.getSeconds() + " "
	cronSchedule += date.getMinutes() + " "
	cronSchedule += date.getHours() + " "
	cronSchedule += date.getDate() + " "
	cronSchedule += date.getMonth() + " "
	cronSchedule += date.getDay()
	return cronSchedule
}

//TODO : To be refactored
var cronJobOptions = {
  // see https://github.com/ncb000gt/node-cron/blob/master/README.md for all available
  start:true,
  timeZone:"Europe/Paris",
  completion: function() {console.log('a quoi ça sert?')}
}

var jobManager = new CronJobManager()

function sendAlert(alert){
	console.log('Activé' + alert.description)
	RssFeed.addItem(alert.eventId, alert.description)
}

module.exports.initializeJobs = function(events){
	events.forEach(function(event){
		event.alerts.forEach(function(alert){
			//Create task unique id
			var taskId = event.id + "-" + alert.id
			var taskCron = dateToCron(new Date(alert.date))
			var taskDescription = {"eventId" : event.id, "description" : alert.description}
			jobManager.add(taskId, taskCron, function () {sendAlert(taskDescription)}, cronJobOptions)
		})
	})	
}


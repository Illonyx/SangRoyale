(function () {

  angular
  .module('sangRoyaleApp')
  .controller('eventsCtrl', eventsCtrl);

  eventsCtrl.$inject = ['$location', 'events'];
  function eventsCtrl($location, events) {
    var vm = this;

    vm.events = []

    vm.addEvent = function(){
      //Browse to new page :)
      $location.path('/events/new')
    }

    vm.deleteEvent = function(eventToDelete){
      //Remove it from events
      var index = vm.events.indexOf(eventToDelete)
      vm.events.splice(index,1)

      //Delete it in database
      events.deleteEvent(eventToDelete._id).success(function(data){
        console.log("Suppression is a success")
      })

    }

    events.getEvents().success(function(data){
      console.log('data' + JSON.stringify(data))
      vm.events=data
    })

    /*
    tournaments.getTournaments()
    .success(function(data) {
    	console.log("Data" + data);
        vm.tournaments = data;
      })
      .error(function (e) {
        console.log(e);
      });
    */
  }

})();
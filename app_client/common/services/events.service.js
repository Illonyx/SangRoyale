(function() {

  angular
    .module('sangRoyaleApp')
    .service('events', events);

  events.$inject = ['$http'];
  function events($http) {

    var getEvent = function(id){
      return $http.get('/api/tournamentContext/' + id)
    }

    var getEvents = function () {
      return $http.get('/api/tournamentContext');
    };

    var addEvent = function(data){
      return $http.post('/api/tournamentContext', data)
    }

    var deleteEvent = function(id){
      return $http.delete('/api/tournamentContext/'+ id)
    }

    return {
      getEvents : getEvents, addEvent : addEvent, deleteEvent : deleteEvent
    };
  }

})();

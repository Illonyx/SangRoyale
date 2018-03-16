(function () {

  angular
  .module('sangRoyaleApp')
  .controller('eventAddCtrl', eventAddCtrl);

  eventAddCtrl.$inject = ['$location', 'events'];
  function eventAddCtrl($location, events) {
    var vm = this;

    /*


tournamentGemProperty : {

        type: {
          password : String, 
          gemnumber : Number
        },
        require : false

    },
    tournamentChallongeProperty : {
      
      type :  {
        code : String,
          url : String,
          type : String,
          eliminationMode : String,
          gamemode : String, 
          isFromLeague : String,
          rewards : Object,
          time : {
        endRegisterDate : String,
            phase1Date : String
          }

      }, 
      require : false
    }



    */

    vm.privacies=["private", "public"]
    vm.gemnumbers=[100,500,2000,10000]
    vm.kinds = ["Gem Tournament", "Bracket Tournament", "Clan War"]
    vm.alerts=[]

    vm.event = {
      tournamentGemProperty: {
        "gemnumber": 100,
        "password": ""
      },
      capacity: 100,
      organizer: "",
      privacy: "private",
      reglement: "Pas de règles spéciales",
      date: "2018-14-04 19:00:00",
      description: "",
      name: "",
      id: "TR792017142746",
      kind : "Gem Tournament",
      properties : {}, 
      league : '',
      alerts : []
    }

    vm.addAlert = function() {
      var counter = vm.alerts.length + 1
      vm.alerts.push({"id":"Alerte" + counter, "date" : "Date à rentrer sous le format YYYY-MM-JJ HH-MM-SS", "description" : "Le message qui sera contenu dans l'alarme"})
    }

    vm.onSubmit = function(){
      vm.event.alerts=vm.alerts
      events.addEvent(vm.event).success(function(data){
        console.log('Is a success')
        $location.path('/events')
      })
    }
  }

})();
(function () {

  angular
  .module('sangRoyaleApp')
  .controller('tournamentsCtrl', tournamentsCtrl);

  tournamentsCtrl.$inject = ['$location', 'tournaments'];
  function tournamentsCtrl($location, tournaments) {
    var vm = this;

    vm.tournaments = {}

    tournaments.getTournaments()
    .success(function(data) {
    	console.log("Data" + data);
        vm.tournaments = data;
      })
      .error(function (e) {
        console.log(e);
      });
  }

})();
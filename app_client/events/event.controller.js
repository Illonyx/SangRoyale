(function () {

  angular
  .module('sangRoyaleApp')
  .controller('eventCtrl', eventCtrl);

  eventCtrl.$inject = ['$routeParams'];
  function eventCtrl($routeParams) {
    var vm = this;

    vm.id = $routeParams.id
  }

})();
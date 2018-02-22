(function () {

  angular
  .module('sangRoyaleApp')
  .controller('exportsCtrl', exportsCtrl);

  exportsCtrl.$inject = ['$location', '$window'];
  function exportsCtrl($location, $window) {
    var vm = this;

    vm.selectedClan = {}
    vm.selectedClan2 = {}
   	vm.sangRoyaleFamily = [
    {"name":"Sang Royale", "id":"CJQLP2"}, 
    {"name":"Sang Royale II", "id":"2LUU0R0L"}, 
    {"name":"Sang Royale III", "id":"8CPG2YU"}, 
    {"name":"Sang Royale IV", "id":"8GQL980P"}, 
    {"name":"Sang Royale V", "id":"8VVGJPCR"}]

    vm.downloadActivity = function(){
      if(vm.selectedClan["id"]){
         $window.open('/api/download/activity/' + vm.selectedClan["id"])
      }
    }

    vm.downloadTrophy = function(){
      if(vm.selectedClan2["id"]){
         $window.open('/api/download/trophy/' + vm.selectedClan2["id"])
      }
    }
    
  }

})();























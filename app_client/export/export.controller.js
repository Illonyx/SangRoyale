(function () {

  angular
  .module('sangRoyaleApp')
  .controller('exportsCtrl', exportsCtrl);

  exportsCtrl.$inject = ['$location', '$window', 'exports'];
  function exportsCtrl($location, $window, exports) {
    var vm = this;

    vm.selectedClan = {}
    vm.selectedClan2 = {}
   	vm.sangRoyaleFamily = [
    {"name":"Sang Royale", "id":"CJQLP2"}, 
    {"name":"Sang Royale II", "id":"2LUU0R0L"}, 
    {"name":"Sang Royale III", "id":"8CPG2YU"}, 
    {"name":"Sang Royale IV", "id":"8GQL980P"}, 
    {"name":"Sang Royale V", "id":"8VVGJPCR"}]
    vm.fileCheck={}


    //return {
    //  getMembersClanChestCrowns: getMembersClanChestCrowns
    //};

    vm.fileCheckActivity = function(clan){
      if(!clan["id"])return ""
      return new Date(vm.fileCheck[clan.id]["mdate-activity"]).toLocaleString()
    }

    vm.fileCheckTrophy = function(clan){
      if(!clan["id"])return ""
      return new Date(vm.fileCheck[clan.id]["mdate-trophies"]).toLocaleString()
    
    }

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

    vm.generateActivity = function(){
      if(vm.selectedClan["id"]){
         exports.generateActivityReport(vm.selectedClan["id"])
      }
    }

    vm.generateTrophy = function(){
      if(vm.selectedClan2["id"]){
         exports.generateTrophyReport(vm.selectedClan2["id"])
      }
    }

    exports.getFileCheck()
    .success(function(data) {
      console.log("Data-fileCheck" + data);
        vm.fileCheck = data;
      })
      .error(function (e) {
        console.log(e);
      });

    
  }

})();























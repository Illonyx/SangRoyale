(function () {

  angular
  .module('sangRoyaleApp')
  .controller('crownchestsCtrl', crownchestsCtrl);

  crownchestsCtrl.$inject = ['crapi']
  function crownchestsCtrl(crapi) {
    var vm = this;
    vm.results=[]
    vm.sangRoyaleFamily = ["CJQLP2", "2LUU0R0L", "8CPG2YU", "8GQL980P"]

    for(var i=0; i < vm.sangRoyaleFamily.length; i++){

      crapi.getClanChestForClan(vm.sangRoyaleFamily[i])
      .success(function(data){
        vm.results.push(data)
        vm.results.sort(function(a,b){
          return b.result - a.result
        })
        //vm.crownChestValues[clanId]

      })
      .error(function(error){
        console.log(error);
      })


    }
    
      



    

    
  }





})();
(function () {

  angular
  .module('sangRoyaleApp')
  .controller('crownchestsCtrl', crownchestsCtrl);

  crownchestsCtrl.$inject = ['crapi']



  function crownchestsCtrl(crapi) {
    var vm = this;
    vm.NB_TOP=5
    vm.results=[]
    vm.memberResults=[]
    vm.error=false
    vm.sangRoyaleFamily = ["CJQLP2", "2LUU0R0L", "8CPG2YU", "8GQL980P"]
    vm.topchest = []


    for(var i=0; i < vm.sangRoyaleFamily.length; i++){

      crapi.getClanChestForClan(vm.sangRoyaleFamily[i])
      .success(function(data){
        vm.results.push(data)
        vm.results.sort(function(a,b){
          return b.result - a.result
        })

      })
      .error(function(error){
        console.log("Error" + error)
        if(error){
          vm.error=true
        }
      })

      crapi.getMembersClanChestCrowns(vm.sangRoyaleFamily[i])
      .success(function(data){
        console.log("ddfz")
        vm.memberResults.push(data)
        if(vm.memberResults.length == vm.sangRoyaleFamily.length){
          vm.topchest = returnTopMembersCrownChests()
        }
      })
      .error(function(error){
        console.log("Error" + error)
        if(error){
          vm.error=true
        }
      })


    }

    var returnTopMembersCrownChests = function(){
      var allFamilyMembers=[]
      for(var i=0; i < vm.memberResults.length; i++) {
        var clanName = vm.memberResults[i].name
        var clanMembers = vm.memberResults[i].members;
        for(var j=0; j < clanMembers.length; j++){
          clanMembers[j].clanName=clanName
          allFamilyMembers.push(clanMembers[j])
        }
      };

      allFamilyMembers.sort(function(a,b){
        return b.clanChestCrowns - a.clanChestCrowns
      });

      console.log('ff' + JSON.stringify(allFamilyMembers))
      return allFamilyMembers.slice(0, vm.NB_TOP)

    };

    
  }

  





})();
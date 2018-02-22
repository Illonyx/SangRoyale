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
    vm.sangRoyaleFamily = [
    {"name":"Sang Royale", "id":"CJQLP2"}, 
    {"name":"Sang Royale II", "id":"2LUU0R0L"}, 
    {"name":"Sang Royale III", "id":"8CPG2YU"}, 
    {"name":"Sang Royale IV", "id":"8GQL980P"},
    {"name":"Sang Royale V", "id":"8VVGJPCR"}]
    vm.topchest = []
    
    for(var i=0; i < vm.sangRoyaleFamily.length; i++){

      crapi.getMembersClanChestCrowns(vm.sangRoyaleFamily[i].id)
      .success(function(data){

        /* Calcul de l'état du CDC total du clan */
        var allCrownchestValues = data.members.map(function(memberResult){
          return memberResult.clanChestCrowns
        })
        var allCumulatedCrowns = allCrownchestValues.reduce(function(accumulateur, currentValue, index, array){
          return accumulateur + currentValue
        })
        var percentage = allCumulatedCrowns/1600*100
        vm.results.push({name : data.name, result : allCumulatedCrowns, percent : percentage})

        
        /* Calcul du top 5 du clan :) */
        vm.memberResults.push(data)
        if(vm.memberResults.length == vm.sangRoyaleFamily.length){
          vm.topchest = returnTopMembersCrownChests()
          vm.results.sort(function(a,b){
            return b.result-a.result
          })
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
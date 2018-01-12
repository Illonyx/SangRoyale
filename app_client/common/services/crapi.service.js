(function() {

  angular
    .module('sangRoyaleApp')
    .service('crapi', crapi);

  crapi.$inject = ['$http'];
  function crapi($http) {

    var getClanChestForClan = function (clanId) {
      return $http.get('api/crownchests/' + clanId);
    };

    var getMembersClanChestCrowns = function(clanId){
      return $http.get('api/membersClanChestCrowns/' + clanId);
    }

    return {
      getClanChestForClan : getClanChestForClan, getMembersClanChestCrowns: getMembersClanChestCrowns
    };
  }

})();
(function() {

  angular
    .module('sangRoyaleApp')
    .service('crapi', crapi);

  crapi.$inject = ['$http'];
  function crapi($http) {

    var getMembersClanChestCrowns = function(clanId){
      return $http.get('api/membersClanChestCrowns/' + clanId);
    }

    return {
      getMembersClanChestCrowns: getMembersClanChestCrowns
    };
  }

})();
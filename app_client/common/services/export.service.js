(function() {

  angular
    .module('sangRoyaleApp')
    .service('exports', exports);

  exports.$inject = ['$http'];
  function exports($http) {

    var getFileCheck = function () {
      return $http.get('/api/filecheck');
    };

    var generateActivityReport = function(clanId){
      return $http.get('/api/generate/activity/'+clanId)
    }

    var generateTrophyReport = function(clanId){
      return $http.get('/api/generate/trophy/' + clanId)
    }

    return {
      getFileCheck : getFileCheck, generateActivityReport : generateActivityReport, generateTrophyReport : generateTrophyReport
    };
  }

})();
(function() {

  angular
    .module('sangRoyaleApp')
    .service('about', about);

  about.$inject = ['$http'];
  function about($http) {

    var getTopic = function () {
      return $http.get('/api/about');
    };

    return {
      getTopic : getTopic
    };
  }

})();
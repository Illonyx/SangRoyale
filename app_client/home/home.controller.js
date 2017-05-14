(function() {
  
  angular
    .module('sangRoyaleApp')
    .controller('homeCtrl', homeCtrl);

    function homeCtrl () {
      console.log('Home controller is running');
    }

})();
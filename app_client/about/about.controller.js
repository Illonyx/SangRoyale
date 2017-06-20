(function () {

  angular
  .module('sangRoyaleApp')
  .controller('aboutCtrl', aboutCtrl);

  aboutCtrl.$inject = ['$location', 'about'];
  function aboutCtrl($location, about) {
    var vm = this;

    about.getTopic()
    .success(function(data) {
    	console.log("Data" + data);
        vm.lasteditiondate = data.lasteditiondate;
        vm.claninfo = data.claninfo;
      })
      .error(function (e) {
        console.log(e);
      });
  }

})();
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
        vm.discordmembers=data.discordmembers;
        vm.topicLinkJV=data.topicLinkJV;
        vm.topicLinkCrFR=data.topicLinkCrFR;
      })
      .error(function (e) {
        console.log(e);
      });
  }

})();
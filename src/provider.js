/*global angular */
(function(angular) {
  "use strict";

  angular.module('angular.apiservice')
    .provider("apiServiceConf", ApiServiceConf);

  function ApiServiceConf() {
    // Stores the different APIs that will be used by the application
    var origins = {};
    // Flag to check if the API call's should be routed to mocks
    var mockFlag = false;
    // Used by ApiService, retrives 'origins'
    this.$get = function(){
      var service = {};
      service.getOrigins = function() {
        return origins;
      }
      service.isMockFlag = function() {
        return mockFlag;
      }
      return service;
    }
    // Use this method to configure the service
    this.config = function(configuration, flag) {
      if (typeof flag === 'boolean') {
        mockFlag = flag;
      }
      return angular.extend(origins, configuration);
    }
    ///////////
    return;
  }
})(angular);
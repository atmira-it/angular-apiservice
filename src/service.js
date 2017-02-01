/*global angular */
(function(angular) {
	'use strict';

	angular.module('angular.apiservice')
		.factory('ApiService', ['$resource', 'filterFilter', 'apiServiceConf', ApiService]);

	function ApiService($resource, filterFilter, apiServiceConf) {
		// Service will store different APIs with theyr own HTTP methods.
		var service = {};
		// Add to 'service' the different APIs configured in the provider
		var origins = apiServiceConf.getOrigins();
		angular.forEach(origins, function(address, origin) {
			service[origin] = configureAPI(origin, address);
		});
		return service;
		//////////////////////

		// This method doesn't configure the API, but returns a method that does it
		function configureAPI(origin, address) {
			return function(endPoint, defaultParams, customActions) {
				var defaultActions = {
					'post': { method: 'POST' }
				}
				var actions = angular.extend(defaultActions, customActions);
				return getConfiguredAPI(origin, address, endPoint, defaultParams, actions);
			}
		}

		function getConfiguredAPI(origin, address, endPoint, defaultParams, customActions) {
			var configuredAPI = {};			
			configuredAPI.defaultParams = defaultParams;
			configuredAPI.apiUrl = address + endPoint;
			configuredAPI.mockUrl = 'app/assets/mocks/' + origin + '/' + endPoint + '.json';

			configuredAPI.$resource = $resource(configuredAPI.apiUrl, defaultParams, customActions);
			configuredAPI.get = _get;
			configuredAPI.query = _query;
			configuredAPI.post = _post;
			configuredAPI.delete = _delete;
			configuredAPI.buildMockedApiCall = _buildMockedApiCall;
			return configuredAPI;
		}

		function _buildMockedApiCall(params, isArray, callback) {
			var url = this.mockUrl;
			var mockFilter = undefined;
			var filterParams = {};
			angular.forEach(params, function(value, param) {
				if (url.includes(':' + param)){
					url.replace(':' + param, value);	
				} else {
					filterParams[param] = value;
				}				
			});
			mockFilter = buildMockFilter(filterParams, isArray);
			return $resource(url, {}, {'query': {method: 'GET', transformResponse: mockFilter, dataType: 'json', isArray: isArray}}).query(null, callback);
		}

		function buildMockFilter(params, isArray) {
			return function mockFilter(jsonData, headers, status) {
				var filteredData = {};
				var data = angular.fromJson(jsonData);
				filteredData = filterFilter(data, params);
				if (isArray) {
					return filteredData;
				} else {
					return filteredData[0];
				}
			}

		}

		function _get(params, callback) {
			if (apiServiceConf.isMockFlag()) {
				return this.buildMockedApiCall(params, false, callback);
			}
			return this.$resource.get(params, callback);
		}
		function _query(params, callback) {
			if (apiServiceConf.isMockFlag()) {
				return this.buildMockedApiCall(params, true, callback);
			}
			return this.$resource.query(params, callback);
		}
		function _post(params, callback) {
			if (apiServiceConf.isMockFlag()) {
				return this.buildMockedApiCall(params, false, callback);
			}
			return this.$resource.post(params, callback);
		}
		function _delete(params, callback) {
			if (apiServiceConf.isMockFlag()) {
				return this.buildMockedApiCall(params, false, callback);
			}
			return this.$resource.delete(params, callback);
		}
	}
})(angular);

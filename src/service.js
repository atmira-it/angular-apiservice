/*global angular */
(function(angular) {
    "use strict";
    angular.module("angular.apiservice").factory("ApiService", [ "$resource", "filterFilter", "apiServiceConf", ApiService ]);
    function ApiService($resource, filterFilter, apiServiceConf) {
        var origins = apiServiceConf.getOrigins();
        var service = {}; // Service will store different APIs with theyr own HTTP methods.
        // Add to 'service' the different APIs configured in the provider        
        angular.forEach(origins, function(originAddress, origin) {
            service[origin] = configureAPI(origin, originAddress);
        });
        return service;
        // ================
        function configureAPI(origin, originAddress) {
            // The first level of the api is a configuration function
            return function(endPoint, defaultParams, customActions) {
                var defaultActions = {
                    post: { method: "POST" }
                };
                var actions = angular.extend(defaultActions, customActions);
                return getApiModel(origin, originAddress, endPoint, defaultParams, actions);
            };
            // The function returned before, allows to do the REST call's
            function getApiModel(origin, address, endPoint, defaultParams, customActions) {
                var url = address + endPoint;
                var isMock = apiServiceConf.isMockFlag();
                var resource = isMock ? null : $resource(url, defaultParams, customActions);
                var ApiModel = {};
                ApiModel.origin = origin;
                ApiModel.endPoint = endPoint;
                ApiModel.$resource = isMock ? $resource : undefined;
                ApiModel.get = isMock ? mockedResponse : resource.get;
                ApiModel.post = isMock ? mockedResponse : resource.post;
                ApiModel.query = isMock ? mockedResponse : resource.query;
                ApiModel.delete = isMock ? mockedResponse : resource.delete;
                return ApiModel;
            }
        }
        // ================
    }

    function mockedResponse(params, bodyParams, callbackOK, callbackKO) {
        var url = 'app/assets/mocks/' + this.origin + '.json';
        this.params = params;
        this.bodyParams = bodyParams;
        // TODO: Cambiar esto para que coja los actions correctamente y sus isArray
        return this.$resource(url, null, {get: {isArray: false, transformResponse: responseFilter.bind(this)}}).get(null, null, callbackOK, callbackKO);
        // ==============
        function responseFilter(jsonData, headers, status) {
            if (status === '404')
                throw jsonData;
            var request = {
                params: this.params,
                bodyParams: this.bodyParams
            };
            var data = dataFromJsonMock(jsonData, this.endPoint);
            if (data === undefined)
                throw "No existe mock con estos datos";
            return responseFromData(data, request);
        }
    }

    function dataFromJsonMock(jsonData, endPoint) {
        var rawData = angular.fromJson(jsonData);
        var data = undefined;
        angular.forEach(rawData, function(element) {
            if (data === undefined && element.endPoint === endPoint) {
                data = element;
            }
        });
        return data;
    }
    function responseFromData(data, request) {
        var response = [];
        angular.forEach(data.data, function(element) {
            if (data.isArray || response.length === 0) {
                if (angular.equals(element.request, request)) {
                    response.push(element.response);
                }
            }
        });
        if (data.isArray) {
            return response;
        } else {
            return response[0];
        }
    }

})(angular);

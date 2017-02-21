/*! angular-apiservice 0.0.1 2017-02-21 */
/*! */
/*global angular */
(function(angular) {
    "use strict";
    angular.module("angular.apiservice", [ "ngResource" ]);
})(angular);

/*global angular */
(function(angular) {
    "use strict";
    angular.module("angular.apiservice").provider("apiServiceConf", ApiServiceConf);
    function ApiServiceConf() {
        // Stores the different APIs that will be used by the application
        var origins = {};
        // Flag to check if the API call's should be routed to mocks
        var mockFlag = false;
        // Used by ApiService, retrives 'origins'
        this.$get = function() {
            var service = {};
            service.getOrigins = function() {
                return origins;
            };
            service.isMockFlag = function() {
                return mockFlag;
            };
            return service;
        };
        // Use this method to configure the service
        this.config = function(configuration, flag) {
            if (typeof flag === "boolean") {
                mockFlag = flag;
            }
            return angular.extend(origins, configuration);
        };
        ///////////
        return;
    }
})(angular);

/*global angular */
(function(angular) {
    "use strict";
    angular.module("angular.apiservice").factory("ApiService", [ "$resource", "filterFilter", "apiServiceConf", ApiService ]);
    function ApiService($resource, filterFilter, apiServiceConf) {
        var origins = apiServiceConf.getOrigins();
        var service = {};
        // Service will store different APIs with theyr own HTTP methods.
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
                    get: {
                        method: "GET",
                        isArray: false
                    },
                    getAll: {
                        method: "GET",
                        isArray: true
                    },
                    post: {
                        method: "POST",
                        isArray: false
                    },
                    query: {
                        method: "POST",
                        isArray: true
                    },
                    delete: {
                        method: "DELETE",
                        isArray: false
                    }
                };
                var actions = angular.extend(defaultActions, customActions);
                return getConfiguredResource(endPoint, defaultParams, actions);
            };
            // The function returned before, allows to do the REST call's
            function getConfiguredResource(endPoint, defaultParams, actions) {
                var Resource = {};
                var api = undefined;
                Resource.endPoint = endPoint;
                Resource.defaultParams = defaultParams;
                if (apiServiceConf.isMockFlag()) {
                    Resource.url = "app/assets/mocks/" + origin + ".json";
                    // TODO: Get the prefix path from the conf Provider
                    angular.forEach(actions, function(action) {
                        action.method = "GET";
                        action.transformResponse = returnMock.bind(Resource);
                    });
                    api = $resource(Resource.url, null, actions);
                    angular.forEach(actions, function(object, name) {
                        Resource[name] = object.isArray ? mockedArrayAction : mockedAction;
                    });
                } else {
                    Resource.url = originAddress + endPoint;
                    api = $resource(Resource.url, defaultParams, actions);
                    angular.forEach(actions, function(object, name) {
                        Resource[name] = api[name];
                    });
                }
                return Resource;
                // =======================
                function mockedAction(params, x, y, z) {
                    this.params = params;
                    this.bodyParams = angular.isObject(x) ? x : undefined;
                    var callbackOK = angular.isFunction(x) ? x : y;
                    var callbackKO = angular.isFunction(x) ? y : z;
                    return api.get(null, callbackOK, callbackKO);
                }
                function mockedArrayAction(params, x, y, z) {
                    this.params = params;
                    this.bodyParams = angular.isObject(x) ? x : undefined;
                    var callbackOK = angular.isFunction(x) ? x : y;
                    var callbackKO = angular.isFunction(x) ? y : z;
                    return api.getAll(null, callbackOK, callbackKO);
                }
                function returnMock(jsonData, getHeaders, status) {
                    if (status === "404") {
                        throw jsonData;
                    }
                    var data = dataFromJsonMock(jsonData, this.endPoint);
                    if (angular.isUndefined(data)) {
                        throw "No existe mock con estos datos";
                    }
                    var request = {};
                    if (angular.isDefined(this.params) || angular.isDefined(this.defaultParams)) {
                        request.params = this.params;
                        angular.extend(request.params, this.defaultParams);
                    }
                    if (angular.isDefined(this.bodyParams)) {
                        request.bodyParams = this.bodyParams;
                    }
                    return responseFromData(data, request);
                }
            }
        }
        function dataFromJsonMock(jsonData, endPoint) {
            var rawData = angular.fromJson(jsonData);
            var data = undefined;
            angular.forEach(rawData, function(element) {
                if (angular.isUndefined(data) && element.endPoint === endPoint) {
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
            // if (data.isArray) {
            //  return response;
            // }
            return response[0];
        }
    }
})(angular);
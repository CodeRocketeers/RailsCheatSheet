'use strict';

var app = angular.module('App', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', { controller: 'sheetsController', templateUrl: 'pages/content.html' } )
        .when('/contribute', { templateUrl: 'pages/contribute.html' } )
        .otherwise( { redirectTo: '/' } );
}]);

app.service('dataLoaderService', ['$http', function($http) {
    
    this.Load = function() {
        var result = { data: null };

        return $http.get('datasource.json');
    }
}]);

app.service('resultService', function() {

    var promise = null;

    this.setPromise = function(value) {
        this.promise = value;
    }

    this.getPromise = function() {
        return this.promise;
    }

});

app.controller('sheetsController', ['$scope', 'dataLoaderService', 'resultService', function($scope, dataLoaderService, resultService) {
    
    $scope.category = null;

    function load() { 
        $scope.sheets = null;
        $scope.currentPage = 0;
        $scope.pageSize = 5;
        $scope.pages = [];
        var promise = dataLoaderService.Load();
        resultService.setPromise(promise);

        promise.then(function(response) {
            $scope.sheets = filterByCategory(response.data.sort(function(a, b) {
                return b.id - a.id
            }));
            $scope.pages = [];
            var pages = Math.ceil($scope.sheets.length / $scope.pageSize);
            for (var i = 0; i < pages; i++) {
                $scope.pages.push(i);
            }
        });
    };

    $scope.setCurrentPage = function(value) {
        if (value < 0) {
            value = 0;
        } else if (value > $scope.pages.length - 1) {
            value = $scope.pages.length - 1;
        }
        $scope.currentPage = value;
    };

    $scope.setCategory = function(value) {
        $scope.category = value;
        load();
    };

    function filterByCategory(sheets) {
        if ($scope.category == null) {
            return sheets;
        }

        var newSheets = [];
        angular.forEach(sheets, function(sheet) {
            angular.forEach(sheet.categories, function(category) {
                if (category == $scope.category) {
                    newSheets.push(sheet);
                }
            })
        })

        return newSheets;
    }

    load();
}]);

app.controller('categoriesController', ['$scope', 'resultService', function($scope, resultService) {
    $scope.categories = null;
    $scope.totalCount = 0;
    resultService.getPromise().then(function(response) {
        $scope.totalCount = response.data.length;
        $scope.categories = getCategories(response.data);
    });

    function getCategories(sheets) {
        var categories = [];
        angular.forEach(sheets, function(sheet) {
            angular.forEach(sheet.categories, function(category) {

                var found = false;

                for (var i = 0; i < categories.length; i++) {
                    if (categories[i].name == category) {
                        categories[i].count++;
                        found = true;
                    }
                }

                if (!found) {
                    categories.push({ name: category, count: 1 });
                }
            });
        });
    
        return categories;
    };
}]);

app.directive('pagination', function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/pagination.html',
        link: function($scope, element, attrs) {}
    }
});

app.filter('html', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}]);

app.filter('orDefaultAvatar', function() {
    return function(val) {
        if (val != '') {
            return val;
        } else {
            return "images/avatar.jpg";
        }
    };
});
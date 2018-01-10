// no expected to be extended anytime, thus all in one file..

'use strict';

var app = angular.module('App', ['ngRoute']);

// router
app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', { controller: 'sheetsController', templateUrl: 'pages/content.html' } )
        .when('/contribute', { templateUrl: 'pages/contribute.html' } )
        .when('/cheatsheet/:id/:title', { controller: 'detailController', templateUrl: 'pages/content.html' })
        .otherwise( { redirectTo: '/' } );
}]);

// services
app.service('dataLoaderService', ['$http', function($http) {

    this.Load = function() {
        var result = { data: null };
				var stamp = Date.now();
        return $http.get('datasource.json?v=' + stamp);
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

// controllers
app.controller('sheetsController', ['$scope', 'dataLoaderService', 'resultService', function($scope, dataLoaderService, resultService) {

    $scope.category = null;
    $scope.isDetail = false;
    $scope.detailPath = "cheatsheet";

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

    $scope.filterSelectedCategory = function(category) {
        if ($scope.category != null) {
            return category.name == $scope.category;
        }
        return true;
    };

    $scope.urlNormalize = function(title) {
        return title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
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
            });
        })

        return newSheets;
    }

    load();
}]);

app.controller('detailController', ['$scope', '$routeParams', 'dataLoaderService', 'resultService', function($scope, $routeParams, dataLoaderService, resultService) {

    $scope.categories = null;
    $scope.isDetail = true;

    $scope.filterSelectedCategory = function(category) {
        var result = false;
        if ($scope.categories != null) {
            var keepGoing = true;
            angular.forEach($scope.categories, function(cat) {
                if (keepGoing) {
                    if (cat == category.name) {
                        result = true;
                        keepGoing = false;
                    }
                }
            });
        }
        return result;
    };

    function load() {
        $scope.sheets = null;
        $scope.currentPage = 0;
        $scope.pageSize = 5;
        $scope.pages = [0];
        var promise = dataLoaderService.Load();
        resultService.setPromise(promise);

        promise.then(function(response) {
            $scope.sheets = filterById(response.data, $routeParams.id);
            if ($scope.sheets.length > 0) {
                $scope.categories = $scope.sheets[0].categories;
            }
        });
    };

    function filterById(sheets, id) {
        var newSheets = [];
        var keepGoing = true;
        angular.forEach(sheets, function(sheet) {
            if(keepGoing) {
              if (sheet.id == id) {
                  newSheets.push(sheet);
                  keepGoing = false;
              }
            }
        });

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

// directives
app.directive('pagination', function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/pagination.html',
        link: function($scope, element, attrs) {}
    }
});

// filters
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

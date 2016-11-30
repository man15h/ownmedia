var app = angular.module('app', ['ngRoute','ngMaterial','ngAnimate','duScroll','angular-scroll-animate','firebase']);
app.config(function($mdThemingProvider) {
  $mdThemingProvider.setDefaultTheme('none');
});
app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);
app.directive("passwordVerify", function() {
   return {
      require: "ngModel",
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watch(function() {
            var combined;

            if (scope.passwordVerify || ctrl.$viewValue) {
               combined = scope.passwordVerify + '_' + ctrl.$viewValue;
            }
            return combined;
        }, function(value) {
            if (value) {
                ctrl.$parsers.unshift(function(viewValue) {
                    var origin = scope.passwordVerify;
                    if (origin !== viewValue) {
                        ctrl.$setValidity("passwordVerify", false);
                        return undefined;
                    } else {
                        ctrl.$setValidity("passwordVerify", true);
                        return viewValue;
                    }
                });
            }
        });
     }
   };
});

// for ngRoute
app.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/");
    }
  });
}]);
app.config(["$routeProvider", function($routeProvider) {
  $routeProvider.when("/", {
    // the rest is the same for ui-router and ngRoute...
    controller: "myCtrl",
    templateUrl: "template/login.html",
    resolve: {
      // controller will not be loaded until $waitForSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
      "currentAuth": ["Auth", function(Auth) {
        // $waitForSignIn returns a promise so the resolve waits for it to complete
        return Auth.$waitForSignIn();
      }]
    }
  }).when("/home", {
    // the rest is the same for ui-router and ngRoute...
    controller: "HomeCtrl",
    templateUrl: "template/dashboard.html",
    resolve: {
      // controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
      "currentAuth": ["Auth", function(Auth) {
        // $requireSignIn returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $stateChangeError (see above)
        return Auth.$requireSignIn();
      }]
    }
  });
}]);
app.controller('myCtrl', function($scope,$rootScope, $routeParams, $location,$http,$sce,$window,$http, $log,$document,Auth,$firebaseAuth) {
  $scope.loginForm=true;
  $scope.signUp=function () {
    $scope.loginForm=false;
    $scope.loginSignupToggle='yes';
  }
  if(Auth.$getAuth()){
    $location.path("/home");
  }
  else if(Auth.$getAuth()==null){
    $location.path("/");
  }
  $scope.createUser = function(email,password) {
    $scope.message = null;
    $scope.error = null;
    // Create a new user
    Auth.$createUserWithEmailAndPassword(email, password)
      .then(function(firebaseUser) {
        $scope.message = "User created with uid: " + firebaseUser.uid;
      }).catch(function(error) {
        $scope.error = error;
      });
  };
  $scope.signIn = function(email,password){
    Auth.$signInWithEmailAndPassword(email,password).then(function(firebaseUser){
      console.log(firebaseUser.uid);
      $location.path("/home");
    })
    .catch(function(error) {

      var errorCode = error.code;
      var errorMessage = error.message;
    });
  }
});
app.controller("HomeCtrl", ['currentAuth','$scope','$rootScope', '$routeParams', '$location','$http','$sce','$window','$http', '$log','$document','Auth', function(currentAuth,$scope,$rootScope, $routeParams, $location,$http,$sce,$window,$http, $log,$document,Auth) {
  console.log(currentAuth);
  $scope.results=[];
   Auth.$onAuthStateChanged(function(firebaseUser) {
     $scope.firebaseUser = firebaseUser;
     console.log($scope.firebaseUser);
   });
   $scope.signOut=function () {
     Auth.$signOut();
     Auth.$onAuthStateChanged(function(firebaseUser) {
       if(firebaseUser==null){
           $location.path("/");
       }
     });
   }
   var $apiEndpoint  = 'https://api.themoviedb.org/3/',
    $apiKey = 'b902673ede213dbd0636564e16adedc2',
    $error_noData = 'Uups! No connection to the database.';
    var $url = $apiEndpoint;
    $scope.searchPopular=function () {
      $url += 'movie/popular';
      $http({
           method: 'GET',
           url: $url,
           params: {
              api_key: $apiKey
            }
         }).then(function successCallback(response) {
           console.log(response);
           $scope.results=response.data.results;
           }, function errorCallback(response) {
             console.log(response);
       });

    };

   $scope.searchQuery=function (search) {
      var $url = $apiEndpoint;
      $url += 'search/multi';
     $http({
          method: 'GET',
          url: $url,
          params: {
             api_key: $apiKey,
             query:search
           }
        }).then(function successCallback(response) {
          console.log(response);
            // for (var i=0; i<response.data.results.length; i++){
            // }
          $scope.results=response.data.results;
          // console.log(response.data.results[0].genre_ids.length);
            for (var i=0; i<response.data.results.length; i++){

                  console.log(response.data.results[i]);

            };
          }, function errorCallback(response) {
            console.log(response);
      });

   }
     // Get data from API
     $scope.searchPopular();
}]);

app.controller("AccountCtrl", ["currentAuth", function(currentAuth) {
  // currentAuth (provided by resolve) will contain the
  // authenticated user or null if not signed in
}]);

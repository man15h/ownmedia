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
  }).when("/details", {
    // the rest is the same for ui-router and ngRoute...
    controller: "detailCtrl",
    templateUrl: "template/details.html",
    resolve: {
      // controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
      "currentAuth": ["Auth", function(Auth) {
        // $requireSignIn returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $stateChangeError (see above)
        return Auth.$requireSignIn();
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
app.controller("HomeCtrl", ['currentAuth','$scope','$rootScope', '$routeParams', '$location','$http','$sce','$mdDialog','$window','$http', '$log','$document','Auth', function(currentAuth,$scope,$rootScope, $routeParams, $location,$http,$sce,$mdDialog,$window,$http, $log,$document,Auth) {
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
      $url = $apiEndpoint;
      $url += 'movie/popular';
      $http({
           method: 'GET',
           url: $url,
           params: {
              api_key: $apiKey
            }
         }).then(function successCallback(response) {
           $scope.results=response.data.results;
           results=response.data.results;
          //  console.log(results);
             for (var i=0; i<results.length; i++){
                   var len=results[i].genre_ids.length;
                   $scope.results[i].genre=[];
                   for (var j=0; j<len; j++){
                      var id=results[i].genre_ids[j];
                     if (id==28) {$scope.results[i].genre.push("Action");}else if (id==12) {$scope.results[i].genre.push("Adeventure");}else if (id==16) {$scope.results[i].genre.push("Animation");}else if (id==35) {$scope.results[i].genre.push("Comedy");}else if (id==80) {$scope.results[i].genre.push("Crime");}else if (id==99) {$scope.results[i].genre.push("Documentry");}else if (id==18) {$scope.results[i].genre.push("Drama");}else if (id==10751) {$scope.results[i].genre.push("Family");}else if (id==14) {$scope.results[i].genre.push("Fanatasy");}else if (id==36) {$scope.results[i].genre.push("Histroy");}else if (id==27) {$scope.results[i].genre.push("Horror");}else if (id==10402) {$scope.results[i].genre.push("Music");}else if (id==9648) {$scope.results[i].genre.push("Mystery");}else if (id==10749) {$scope.results[i].genre.push("Romance");}else if (id==878) {$scope.results[i].genre.push("Sci-Fi");}else if (id==10770) {$scope.results[i].genre.push("Tv Movie");}else if (id==53) {$scope.results[i].genre.push("Thriller");}else if (id==10752) {$scope.results[i].genre.push("War");}else if (id==37) {$scope.results[i].genre.push("Western");}else {$scope.results[i].genre.push("Unlknow");}
                   };
             };
             console.log($scope.results);
           }, function errorCallback(response) {
             console.log(response);
       });

    };
    $scope.getPopular=function () {
       $scope.searchPopular();
    }
   $scope.searchQuery=function (search) {
      $url = $apiEndpoint;
      $url += 'search/multi';
     $http({
          method: 'GET',
          url: $url,
          params: {
             api_key: $apiKey,
             query:search
           }
        }).then(function successCallback(response) {
            $scope.results=response.data.results;
            results=response.data.results;
              for (var i=0; i<results.length; i++){
                    var len=results[i].genre_ids.length;
                    $scope.results[i].genre=[];
                    for (var j=0; j<len; j++){
                       var id=results[i].genre_ids[j];
                      if (id==28) {$scope.results[i].genre.push("Action");}else if (id==12) {$scope.results[i].genre.push("Adeventure");}else if (id==16) {$scope.results[i].genre.push("Animation");}else if (id==35) {$scope.results[i].genre.push("Comedy");}else if (id==80) {$scope.results[i].genre.push("Crime");}else if (id==99) {$scope.results[i].genre.push("Documentry");}else if (id==18) {$scope.results[i].genre.push("Drama");}else if (id==10751) {$scope.results[i].genre.push("Family");}else if (id==14) {$scope.results[i].genre.push("Fanatasy");}else if (id==36) {$scope.results[i].genre.push("Histroy");}else if (id==27) {$scope.results[i].genre.push("Horro");}else if (id==10402) {$scope.results[i].genre.push("Music");}else if (id==9648) {$scope.results[i].genre.push("Mystery");}else if (id==10749) {$scope.results[i].genre.push("Romance");}else if (id==878) {$scope.results[i].genre.push("Sci-Fi");}else if (id==10770) {$scope.results[i].genre.push("Tv Movie");}else if (id==53) {$scope.results[i].genre.push("Thriller");}else if (id==10752) {$scope.results[i].genre.push("War");}else if (id==37) {$scope.results[i].genre.push("Western");}else {$scope.results[i].genre.push("Unlknow");}
                    };
              };
              console.log($scope.results);
          }, function errorCallback(response) {
            console.log(response);
      });

   };
   $scope.getTopRated=function () {
     console.log("hello");
     $url = $apiEndpoint;
     $url += 'movie/top_rated';
    $http({
         method: 'GET',
         url: $url,
         params: {
            api_key: $apiKey
          }
       }).then(function successCallback(response) {
         console.log(response);
           $scope.results=response.data.results;
           results=response.data.results;
             for (var i=0; i<results.length; i++){
                   var len=results[i].genre_ids.length;
                   $scope.results[i].genre=[];
                   for (var j=0; j<len; j++){
                      var id=results[i].genre_ids[j];
                     if (id==28) {$scope.results[i].genre.push("Action");}else if (id==12) {$scope.results[i].genre.push("Adeventure");}else if (id==16) {$scope.results[i].genre.push("Animation");}else if (id==35) {$scope.results[i].genre.push("Comedy");}else if (id==80) {$scope.results[i].genre.push("Crime");}else if (id==99) {$scope.results[i].genre.push("Documentry");}else if (id==18) {$scope.results[i].genre.push("Drama");}else if (id==10751) {$scope.results[i].genre.push("Family");}else if (id==14) {$scope.results[i].genre.push("Fanatasy");}else if (id==36) {$scope.results[i].genre.push("Histroy");}else if (id==27) {$scope.results[i].genre.push("Horro");}else if (id==10402) {$scope.results[i].genre.push("Music");}else if (id==9648) {$scope.results[i].genre.push("Mystery");}else if (id==10749) {$scope.results[i].genre.push("Romance");}else if (id==878) {$scope.results[i].genre.push("Sci-Fi");}else if (id==10770) {$scope.results[i].genre.push("Tv Movie");}else if (id==53) {$scope.results[i].genre.push("Thriller");}else if (id==10752) {$scope.results[i].genre.push("War");}else if (id==37) {$scope.results[i].genre.push("Western");}else {$scope.results[i].genre.push("Unlknow");}
                   };
             };
             console.log($scope.results);
         }, function errorCallback(response) {
           console.log(response);
     });
   };
   $scope.upcoming=function () {
     $url = $apiEndpoint;
     $url += 'movie/upcoming';
    $http({
         method: 'GET',
         url: $url,
         params: {
            api_key: $apiKey
          }
       }).then(function successCallback(response) {
           $scope.results=response.data.results;
           results=response.data.results;
             for (var i=0; i<results.length; i++){
                   var len=results[i].genre_ids.length;
                   $scope.results[i].genre=[];
                   for (var j=0; j<len; j++){
                      var id=results[i].genre_ids[j];
                     if (id==28) {$scope.results[i].genre.push("Action");}else if (id==12) {$scope.results[i].genre.push("Adeventure");}else if (id==16) {$scope.results[i].genre.push("Animation");}else if (id==35) {$scope.results[i].genre.push("Comedy");}else if (id==80) {$scope.results[i].genre.push("Crime");}else if (id==99) {$scope.results[i].genre.push("Documentry");}else if (id==18) {$scope.results[i].genre.push("Drama");}else if (id==10751) {$scope.results[i].genre.push("Family");}else if (id==14) {$scope.results[i].genre.push("Fanatasy");}else if (id==36) {$scope.results[i].genre.push("Histroy");}else if (id==27) {$scope.results[i].genre.push("Horro");}else if (id==10402) {$scope.results[i].genre.push("Music");}else if (id==9648) {$scope.results[i].genre.push("Mystery");}else if (id==10749) {$scope.results[i].genre.push("Romance");}else if (id==878) {$scope.results[i].genre.push("Sci-Fi");}else if (id==10770) {$scope.results[i].genre.push("Tv Movie");}else if (id==53) {$scope.results[i].genre.push("Thriller");}else if (id==10752) {$scope.results[i].genre.push("War");}else if (id==37) {$scope.results[i].genre.push("Western");}else {$scope.results[i].genre.push("Unlknow");}
                   };
             };
             console.log($scope.results);
         }, function errorCallback(response) {
           console.log(response);
     });
   };
   $scope.nowPlaying=function () {
     var $url = $apiEndpoint;
     $url += 'movie/now_playing';
    $http({
         method: 'GET',
         url: $url,
         params: {
            api_key: $apiKey
          }
       }).then(function successCallback(response) {
         $scope.results=response.data.results;
         results=response.data.results;
           for (var i=0; i<results.length; i++){
                 var len=results[i].genre_ids.length;
                 $scope.results[i].genre=[];
                 for (var j=0; j<len; j++){
                    var id=results[i].genre_ids[j];
                   if (id==28) {$scope.results[i].genre.push("Action");}else if (id==12) {$scope.results[i].genre.push("Adeventure");}else if (id==16) {$scope.results[i].genre.push("Animation");}else if (id==35) {$scope.results[i].genre.push("Comedy");}else if (id==80) {$scope.results[i].genre.push("Crime");}else if (id==99) {$scope.results[i].genre.push("Documentry");}else if (id==18) {$scope.results[i].genre.push("Drama");}else if (id==10751) {$scope.results[i].genre.push("Family");}else if (id==14) {$scope.results[i].genre.push("Fanatasy");}else if (id==36) {$scope.results[i].genre.push("Histroy");}else if (id==27) {$scope.results[i].genre.push("Horro");}else if (id==10402) {$scope.results[i].genre.push("Music");}else if (id==9648) {$scope.results[i].genre.push("Mystery");}else if (id==10749) {$scope.results[i].genre.push("Romance");}else if (id==878) {$scope.results[i].genre.push("Sci-Fi");}else if (id==10770) {$scope.results[i].genre.push("Tv Movie");}else if (id==53) {$scope.results[i].genre.push("Thriller");}else if (id==10752) {$scope.results[i].genre.push("War");}else if (id==37) {$scope.results[i].genre.push("Western");}else {$scope.results[i].genre.push("Unlknow");}
                 };
           };
            console.log(results);

         }, function errorCallback(response) {
           console.log(response);
     });
   };
   $scope.fetchDetail=function(result){
     $rootScope.detailResult=result;
     $location.path("/details");
   };
   $scope.userDetails=function (ev) {
       $mdDialog.show({
         controller: function ($mdDialog,Auth) {
                     Auth.$onAuthStateChanged(function(firebaseUser) {
                       $scope.firebaseUser = firebaseUser;
                     });
                     console.log($scope.firebaseUser.email);
                    var vm = this;
                    vm.user = {};
                    vm.email=$scope.firebaseUser.email;
                    $scope.hide = function () {
                        $mdDialog.hide();
                    };
                    $scope.cancel = function () {
                      $mdDialog.cancel();
                    };
                },
         controllerAs: 'infomodal',
         templateUrl: 'template/user.html',
         targetEvent: ev,
         parent: angular.element(document.body),
         clickOutsideToClose:true,
         fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
       })
       .then(function(answer) {
       }, function() {
       });
   };











    $scope.searchPopular();
}]);
app.controller("detailCtrl", ['currentAuth','$scope','$rootScope', '$routeParams', '$location','$http','$sce','$window','$http', '$log','$document','Auth', function(currentAuth,$scope,$rootScope, $routeParams, $location,$http,$sce,$window,$http, $log,$document,Auth) {
  console.log(currentAuth);
  $scope.detail=$rootScope.detailResult;
  $scope.fullDetail=[];
  var $apiEndpoint  = 'https://api.themoviedb.org/3/',
  $apiKey = 'b902673ede213dbd0636564e16adedc2',
  $error_noData = 'Uups! No connection to the database.';
  var what_to_do='';
  if($scope.detail.media_type==null){
    what_to_do='movie/'
  }
  else{
    what_to_do=$scope.detail.media_type;
  }
  var $url = $apiEndpoint;
  $url+=what_to_do;
  $url+=$scope.detail.id;
  $scope.fetchFullData=function () {
    console.log($url);
    // https://api.themoviedb.org/3/movie/284052/videos?api_key=b902673ede213dbd0636564e16adedc2&language=en-US
    $http({
         method: 'GET',
         url: $url,
         params: {
            api_key: $apiKey
          }
       }).then(function successCallback(response) {
           $scope.fullDetail=response.data;console.log(response);
         }, function errorCallback(response) {
           console.log(response);
     });
   }
   $scope.fetchFullData();
   console.log( $scope.fullDetail);
}]);
app.controller("AccountCtrl", ["currentAuth", function(currentAuth) {
  // currentAuth (provided by resolve) will contain the
  // authenticated user or null if not signed in
}]);

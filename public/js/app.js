var app = angular.module("app",["ui.router"])
	
	.config(function($stateProvider,$urlRouterProvider,$locationProvider){

		

			$stateProvider
			.state("home",{
				url:"/",
				templateUrl : "templates/home.html",
								controller:"homeCtrl"

			}).
			state("home2",{
				url:"/",
				templateUrl : "templates/home2.html"
			})
			.state("login",{
				url:"/login",
				templateUrl : "templates/login.html",
				controller:"loginCtrl"
			})
			.state("signup",{
				url:"/signup",
				templateUrl : "templates/signup.html",
				controller:"signupCtrl"

			})



			$urlRouterProvider.otherwise("/login")


			$locationProvider.html5Mode(true);

	})


	.run(function($rootScope,$state,AuthService){
		$rootScope.$on("$stateChangeStart",function(event,next,nextParams,fromState){
			if(!AuthService.isAuthenticated()){


				if(next.name != "login" && next.name !="signup"){
					event.preventDefault()
					$state.go("login")
				}
			}
		})



	})










	

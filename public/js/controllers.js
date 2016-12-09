app
	.controller("loginCtrl", function($scope, $state, AuthService) {
		$scope.user = {
			email: "",
			password: ""
		}
		$scope.error = ""

		$scope.login = function() {
			AuthService.login($scope.user).then(function(data) {
				$state.go("home");
			}).catch(function(err) {
				$scope.error = err
			})

		}

		$scope.login_fb = function() {
			FB.login(function(response) {
				if (response.authResponse) {
					console.log('Welcome!  Fetching your information.... ');
					FB.api('/me?fields=name,email', function(response) {
						console.log('Good to see you, ' + response.name + '.');
						console.log(response)

						var accessToken = FB.getAuthResponse().accessToken
						console.log(accessToken)
						AuthService.login_fb(accessToken).then(function(data) {
							$state.go("home");
						}).catch(function(err) {
							$scope.error = err
						})

					});
				} else {
					console.log('User cancelled login or did not fully authorize.');
				}
			});


		}



	})


.controller("signupCtrl", function($scope, $state, AuthService) {
	$scope.user = {
		name: "",
		email: "",
		password: ""
	}
	$scope.error = ""

	$scope.signup = function() {
		AuthService.signup($scope.user).then(function(data) {
			$state.go("home");
		}).catch(function(err) {
			$scope.error = err
		})

	}
})


.controller("homeCtrl", function($http, $scope, $state, AuthService, API_ENDPOINT) {
	$scope.destroySession = function() {

		AuthService.logout()
	}
	$scope.getInfo = function() {
		$http.get(API_ENDPOINT.url + "/user").then(function(response) {
			$scope.user = response.data
			console.log("bbjkbkjn" + response.data)
		})
	}
	$scope.logout = function() {
		AuthService.logout();
		$state.go("login")
	}
})


.controller("appCtrl", function(AuthService, $scope, $state, AUTH_EVENTS) {
	$scope.isAuth = AuthService.isAuthenticated()

	$scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
		AuthService.logout()
		$state.go("login")
	})
})
app

	.service("AuthService", function($q, $http, API_ENDPOINT, $q, $window) {
		var LOCAL_TOKEN_KEY = "token"
		var isAuthenticated = false
		var authToken

		var storeUserCredentials = function(token) {
			if (token) {
				$window.localStorage.setItem(LOCAL_TOKEN_KEY, token)
				setUserCredentians(token)
			}
		}

		var setUserCredentians = function(token) {
			isAuthenticated = true;
			authToken = token;
			$http.defaults.headers.common.Authorization = authToken;
		}



		var login = function(user) {
			console.log(user)
			return $http.post(API_ENDPOINT.url + "/login", user)
				.then(function(response) {
					if (response.data.success) {
						storeUserCredentials(response.data.token);
						return response.data.msg

					} else {
						return $q.reject(response.data.msg)
					}
				})
		}

		var login_fb = function(access) {
			return $http.get(API_ENDPOINT.url + "/auth/facebook/?access_token="+access)
				.then(function(response) {
					if (response.data.success) {
						storeUserCredentials(response.data.token);
						return response.data.msg

					} else {
						return $q.reject(response.data.msg)
					}
				})
		}

		var destroyUserCredentials = function() {
			isAuthenticated = false
			authToken = undefined
			$http.defaults.headers.common.Authorization = undefined;
			$window.localStorage.removeItem(LOCAL_TOKEN_KEY)
		}

		var signup = function(user){
			return $http.post(API_ENDPOINT.url+"/signup",user)
				.then(function(response){
					if(response.data.success){
						storeUserCredentials(response.data.token);
						return response.data.msg

					}else{
						console.log('else');
						return $q.reject(response.data.msg)
					}
				})
		}

		var logout = function(){
			destroyUserCredentials()
		}

		var loadUserCredentials = function(){
			var token = $window.localStorage.getItem(LOCAL_TOKEN_KEY)
			if(token)
				setUserCredentians(token)

		}

		loadUserCredentials()



		return {
			login: login,
			signup: signup,
			logout: logout,
			login_fb:login_fb,
			isAuthenticated: function() {
				return isAuthenticated;
			}
		}
	})
	.service("AuthInterceptor", ["$q", "$rootScope", "AUTH_EVENTS" ,function($q, $rootScope, AUTH_EVENTS) {
	
	
			return {
				responseError : function(response){
					if(response.status === 401){
						$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated,response);
					}
					return $q.reject(response)
				}
			}
		}])

.config(["$httpProvider", function($httpProvider) {

		$httpProvider.interceptors.push("AuthInterceptor")
}])










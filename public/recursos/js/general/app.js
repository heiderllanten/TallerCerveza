"use strict";

/*El use strict hace que se deba codificar de manera correcta, siendo estricto
 * a la hora de compilar el codigo ejemplo:
 * x = 3.14; // This will cause an error (x is not defined)*/

/*Se definen las depenciencias que seran utilizadas por el sistema, son varias
* se separan asi: ['ngRoute', 'ngCookies', 'xxxxx']*/
var app = angular.module('myModule', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
	.when("/cerveza", {
		controller: 'CtlCerveza',
		templateUrl : "vista/cerveza.html"
	})
	.when("/produccion", {
		templateUrl : "vista/produccion.html"
	})
	.when("/presentacion", {
		templateUrl : "vista/presentacion.html"
	})
	.when("/logo", {
		templateUrl : "vista/logo.html"
	})
	.otherwise({
		redirectTo: '/cerveza'
	});
});

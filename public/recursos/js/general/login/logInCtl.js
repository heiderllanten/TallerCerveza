"use strict";

/*El use strict hace que se deba codificar de manera correcta, siendo estricto
 * a la hora de compilar el codigo ejemplo: 
 * x = 3.14; // This will cause an error (x is not defined)*/


 /* global app */

/*Toda funcion de controlador debe tener un $scope, que es la referencia a todos
* los elementos que pertenecen al constrolador*/
/*app.controller(nombre de la funcion)  ($scope, nombre de los servicios a utilizar)*/
/*$windows servicio por defecto para poder utilizar refresco de pagina y redireccionamiento*/
/*logInService, nombre del servicio que contiene la promesa. */
app.controller('CtlLogIn', function ($scope, logInService) {

    /*Se inicializa el modelo*/
    $scope.identificacion = "";

    /*Se define una funcion en el controlador*/
    $scope.logIn = function (form) {
        /*Al ser el servicio la llamada por http (funcion asincrona) toca definir
         * promesas con el "then", que se ejecuta unicamente cuando se le retorna
         * un valor valido. Este se ejecuta unicamente cuando el llamado http 
         * consume el REST ("REST" es un paradigma, mientras"RESTful" describe el 
         * uso de ese paradigma*/

         /*Si el formulario esta bien validado*/
         if (form) {
            /*Se ejecuta la funcion mandando por parametro el objeto identificacion, 
            * el cual esta asociado a los input*/
            logInService.logIn($scope.identificacion).then(function (response) {
                /*El resultado de la promesa se recibe por parametro*/
                if (response.length > 0) {
                    alert(response.usuario+""+response.password);
                } else {
                    alert("Usuario o contrasena incorrectos");
                    /*Solo con limpiar el objeto se limpian todos los input 
                    * asociados*/
                    $scope.identificacion = "";
                }
            });
        } else {
            alert("Verifique los datos ingresados");
        }
    };

});







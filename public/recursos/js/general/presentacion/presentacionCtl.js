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
app.controller('CtlPresentacion', function ($scope, presentacionService) {

    /*Se inicializa el modelo*/
    $scope.presentacion = "";

    /*Se define una funcion en el controlador*/
    $scope.crearPresentacion = function (form) {
         if (form) {
            presentacionService.crearPresentacion($scope.presentacion).then(function (response) {
                console.log(response);
                if (response.exito) {
                    alert("Cerveza creada con exito");
                    $scope.presentacion = "";
                    $scope.listar();
                } else {
                    alert("No se pudo crear al cerveza");
                    $scope.presentacion = "";
                }
            });
        } else {
            alert("Verifique los datos ingresados");
        }
    };
    $scope.eliminarPresentacion = function (presentacion) {
          presentacionService.eliminarPresentacion(presentacion).then(function (response) {
              if (response.exito) {
                  $scope.presentacion = "";
                  $scope.listar();
                  alert("Se elimino con exito");
              } else if(response.exito===false) {
                  $scope.presentacion = "";
                  alert("No se elimino ninguna fila");
              }else{
                $scope.presentacion = "";
                alert("Error al tratar de eliminar la cerveza");
              }
          });
      };

      $scope.editarPresentacion = function (form) {
            presentacionService.editarPresentacion($scope.presentacion).then(function (response) {
                if (response.exito) {
                    $scope.presentacion = "";
                    $scope.listar();
                    alert("Se edito con exito");
                } else if(response.exito===false) {
                    $scope.presentacion = "";
                    alert("No se edito ninguna fila");
                }else{
                  $scope.presentacion = "";
                  alert("Error al tratar de editar la cerveza");
                }
            });
        };

    $scope.listar = function () {
        presentacionService.listar().then(function (response) {
            $scope.presentaciones = [];
            console.log(response[0]);
            if (response.length !== 0) {
                $scope.presentaciones.length = 0;
                for (var i = 0; i < response.length; i++) {
                    $scope.presentaciones.push({ml: response[i].ml, valor:
                                response[i].valor
                    });
                }
            }
        });
    };
    $scope.llenarCampos = function (obj){
       obj.ml = parseInt(obj.ml);
       obj.valor = parseInt(obj.valor);
       $scope.presentacion = obj;

   };

   $scope.ordenarPor = function (tipo) {
       $scope.ordenarSeleccionado = tipo;
   };

   $scope.listar();

});

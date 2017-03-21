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
app.controller('CtlCerveza', function ($scope, cervezaService) {

    /*Se inicializa el modelo*/
    $scope.cerveza = "";

    /*Se define una funcion en el controlador*/
    $scope.crearCerveza = function (form) {
         if (form) {
            cervezaService.crearCerveza($scope.cerveza).then(function (response) {
                console.log(response);
                if (response.exito) {
                    alert("Cerveza creada con exito");
                    $scope.cerveza = "";
                    $scope.listar();
                } else {
                    alert("No se pudo crear al cerveza");
                    $scope.cerveza = "";
                }
            });
        } else {
            alert("Verifique los datos ingresados");
        }
    };
    $scope.eliminarcerveza = function (cerveza) {
          cervezaService.eliminarcerveza(cerveza).then(function (response) {
              if (response.exito) {
                  $scope.cerveza = "";
                  $scope.listar();
                  alert("Se elimino con exito");
              } else if(response.exito===false) {
                  $scope.cerveza = "";
                  alert("No se elimino ninguna fila");
              }else{
                $scope.cerveza = "";
                alert("Error al tratar de eliminar la cerveza");
              }
          });
      };

      $scope.editarCerveza = function (form) {
            cervezaService.editarCerveza($scope.cerveza).then(function (response) {
                if (response.exito) {
                    $scope.cerveza = "";
                    $scope.listar();
                    alert("Se edito con exito");
                } else if(response.exito===false) {
                    $scope.cerveza = "";
                    alert("No se edito ninguna fila");
                }else{
                  $scope.cerveza = "";
                  alert("Error al tratar de editar la cerveza");
                }
            });
        };

    $scope.listar = function () {
        cervezaService.listar().then(function (response) {
            $scope.cervezas = [];
            console.log(response[0]);
            if (response.length !== 0) {
                $scope.cervezas.length = 0;
                for (var i = 0; i < response.length; i++) {
                    $scope.cervezas.push({nombre: response[i].nombre, descripcion:
                                response[i].descripcion, porcentaje_alcohol: response[i].porcentaje_alcohol
                    });
                }
            }
        });
    };
    $scope.llenarCampos = function (obj){
       obj.porcentaje_alcohol = parseInt(obj.porcentaje_alcohol);
       $scope.cerveza = obj;

   };

   $scope.ordenarPor = function (tipo) {
       $scope.ordenarSeleccionado = tipo;
   };

   $scope.listar();

});

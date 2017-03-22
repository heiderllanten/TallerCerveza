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
app.controller('CtlProduccion', function ($scope, produccionService, cervezaService, presentacionService) {

    /*Se inicializa el modelo*/
    $scope.produccion = {};    
    $scope.producciones = [];
    $scope.cervezas = [];
    $scope.presentaciones = [];

    /*Se define una funcion en el controlador*/
    $scope.crearProduccion = function (form) {
         if (form) {
            produccionService.crearProduccion($scope.produccion).then(function (response) {
                console.log(response);
                if (response.exito) {
                    alert("produccion creada con exito");
                    $scope.produccion = "";
                    $scope.listar();
                } else {
                    alert("No se pudo crear la produccion");
                    $scope.produccion = "";
                }
            });
        } else {
            alert("Verifique los datos ingresados");
        }
    };

    $scope.eliminarProduccion = function (produccion) {
          produccionService.eliminarProduccion(produccion).then(function (response) {
              if (response.exito) {
                  $scope.produccion = "";                  
                  $scope.listar();
                  alert("Se elimino con exito");
              } else if(response.exito===false) {
                  $scope.produccion = "";
                  alert("No se elimino ninguna fila");
              }else{
                $scope.produccion = "";
                alert("Error al tratar de eliminar la produccion");
              }
          });
      };

      $scope.editarProduccion = function (form) {
            produccionService.editarProduccion($scope.produccion).then(function (response) {
                if (response.exito) {
                    $scope.produccion = "";
                    $scope.listar();
                    alert("Se edito con exito");
                } else if(response.exito===false) {
                    $scope.produccion = "";
                    alert("No se edito ninguna fila");
                }else{
                  $scope.produccion = "";
                  alert("Error al tratar de editar la produccion");
                }
            });
        };

    $scope.listar = function () {
        produccionService.listar().then(function (response) {            
            console.log(response[0]);            
            $scope.producciones.length = 0;
            if (response.length !== 0) {                
                for (var i = 0; i < response.length; i++) {
                    $scope.producciones.push({codigo: response[i].codigo, descripcion:
                                response[i].descripcion, tipo: response[i].tipo, fecha: new Date(response[i].fecha),
                                presentacion: response[i].presentacion
                    });
                }
            }
        });
    };

    $scope.listarTipos = function () {
        cervezaService.listar().then(function (response) {            
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

    $scope.listarPresentaciones = function () {
        presentacionService.listar().then(function (response) {            
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
      obj.fecha = new Date(obj.fecha);
      $scope.produccion = obj;
   };

   $scope.ordenarPor = function (tipo) {
       $scope.ordenarSeleccionado = tipo;
   };

   $scope.listar();
   $scope.listarTipos();
   $scope.listarPresentaciones();
});

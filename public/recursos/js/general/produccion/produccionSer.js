"use strict";


/*El use strict hace que se deba codificar de manera correcta, siendo estricto
 * a la hora de compilar el codigo ejemplo:
 * x = 3.14; // This will cause an error (x is not defined)*/



/* global app */


/*************servicio vs factory vs provider***************/
/*Todas son SINGLETON (Unicamente puede ser instanciada una vez en el contexto
 * en el cual se encuentre)*/


/*Se define el servicio (app.service(nombre servicio, funcionalidad))*/
/*El $http es un servicio por defecto para consumir GET,POST,ETC. El
 * $httpParamSerializerJQLike es necesario, debido a que angular empaqueta los
 * datos diferente a como se hacia en jquery  y muchos webservices no encuentran
 * los datos que les llega, por lo que se hace necesario serializarlos como
 * jquery para que lleguen al servidor*/
app.service('produccionService', function ($http, $httpParamSerializerJQLike) {
    this.crearProduccion = function (produccion) {
        var promise = $http({
            method: "POST",
            url: "/crearProduccion",
            data: $httpParamSerializerJQLike({
                codigo: produccion.codigo,
                descripcion:produccion.descripcion,
                fecha: produccion.fecha,
                tipo: produccion.tipo,
                presentacion: produccion.presentacion}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function mySucces(response) {
            return response.data;
        }, function myError(response) {
            alert("Error");
            alert(response.statusText);
        });
        return promise;
    };

    this.editarProduccion = function (produccion) {
        var promise = $http({
            method: "put",
            url: "/editarProduccion",
            data: $httpParamSerializerJQLike({
                codigo: produccion.codigo,
                descripcion:produccion.descripcion,
                tipo: produccion.tipo,
                presentacion: produccion.presentacion,
                fecha: produccion.fecha}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function mySucces(response) {
            return response.data;
        }, function myError(response) {
            alert("Error");
            alert(response.statusText);
        });
        return promise;
    };

    this.listar = function () {
        var promise = $http({
            method: "get",
            url: "/listarProducciones"
        }).then(function mySucces(response) {
            return response.data;
        }, function myError(response) {
            alert("Error");
            alert(response.statusText);
        });
        return promise;
    };

    this.eliminarProduccion = function (produccion) {
        var promise = $http({
            method: "delete",
            url: "/eliminarProduccion",
            data: $httpParamSerializerJQLike({
                codigo: produccion.codigo}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function mySucces(response) {
            return response.data;
        }, function myError(response) {
            alert("Error");
            alert(response.statusText);
        });
        return promise;
    };
});

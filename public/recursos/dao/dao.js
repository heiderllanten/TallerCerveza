/*Modulo para la captura de variables GET y POST*/
var querystring = require('querystring');
/*Se importa el modulo npm MYSQL*/
var mysql = require('mysql');
function conectardb() {

    //Se hace una conexion a la base de datos
    conexion = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'tallercerveza'
    });
    //Se conecta a la base de datos
    conexion.connect(function (error) {
        if (error) {
            console.log('Problemas de conexion con mysql');
        } else {
            console.log('Conexion exitosa');
        }
    });
}




function crear(pedido,respuesta) {
  var info = '';
  pedido.on('data', function (datosparciales) {
      info += datosparciales;
  });
  pedido.on('end', function () {
      var datos = querystring.parse(info);
      var registro = {
          nombre: datos['nombre'],
          descripcion: datos['descripcion'],
          porcentaje_alcohol: datos['porcentaje_alcohol']
      };
      var sql = 'insert into tipocerveza set ?';
      conexion.query(sql, registro, function (error, resultado) {
          if (error) {
            console.log("error");
              console.log('error en la consulta');
              respuesta.write('{"exito":false}');
              respuesta.end();
          }else{
            respuesta.write('{"exito":true}');
            respuesta.end();
          }
        });
  });
}

function crearPresentacion(pedido,respuesta) {
  var info = '';
  pedido.on('data', function (datosparciales) {
      info += datosparciales;
  });
  pedido.on('end', function () {
      var datos = querystring.parse(info);
      var registro = {
          ml: datos['ml'],
          valor: datos['valor']
      };
      var sql = 'insert into presentacion set ?';
      conexion.query(sql, registro, function (error, resultado) {
          if (error) {
            console.log("error");
              console.log('error en la consulta');
              respuesta.write('{"exito":false}');
              respuesta.end();
          }else{
            respuesta.write('{"exito":true}');
            respuesta.end();
          }
        });
  });
}

function crearProduccion (pedido,respuesta) {
  var info = '';
  pedido.on('data', function (datosparciales) {
      info += datosparciales;
  });
  pedido.on('end', function () {
      var datos = querystring.parse(info);
      console.log(datos);
      var registro = {
          codigo: datos['codigo'],
          tipo: datos['tipo'],
          presentacion: datos['presentacion'],
          fecha: datos['fecha'],
          comentarios: datos['descripcion']
      };
      var sql = 'insert into produccion set ?';
      conexion.query(sql, registro, function (error, resultado) {
          if (error) {
            console.log("error");
              console.log('error en la consulta');
              respuesta.write('{"exito":false}');
              respuesta.end();
          }else{
            respuesta.write('{"exito":true}');
            respuesta.end();
          }
        });
  });
}

function listarCervezas(respuesta) {

    var sql = 'select nombre,descripcion,porcentaje_alcohol from tipocerveza';

    //Se realiza la consulta, recibiendo por parametro filas los registros de la base de datos.
    conexion.query(sql, function (error, filas) {
        if (error) {
            console.log('error en el listado');
            respuesta.write(null);
            respuesta.end();
            return;
        }else{
          var res='[';
          if(filas.length > 0){
            for(var i=0;i<filas.length;i++){
              res+='{';
              res+='"nombre":"'+filas[i].nombre+'",';
              res+='"descripcion":"'+filas[i].descripcion+'",';
              res+='"porcentaje_alcohol":"'+filas[i].porcentaje_alcohol+'"},';
            }
            res=res.slice(0,-1);
          }
          res+=']';
          console.log(res);
          respuesta.write(res);
          respuesta.end();
        }
    });
}

function listarPresentaciones(respuesta) {

    var sql = 'select ml,valor from presentacion';

    //Se realiza la consulta, recibiendo por parametro filas los registros de la base de datos.
    conexion.query(sql, function (error, filas) {
        if (error) {
            console.log('error en el listado');
            respuesta.write(null);
            respuesta.end();
            return;
        }else{
          var res='[';
          if(filas.length > 0){
            for(var i=0;i<filas.length;i++){
              res+='{';
              res+='"ml":"'+filas[i].ml+'",';
              res+='"valor":"'+filas[i].valor+'"},';

            }
            res=res.slice(0,-1);
          }
          res+=']';
          console.log(res);
          respuesta.write(res);
          respuesta.end();
        }
    });
}

function listarProducciones(respuesta) {

    var sql = 'select codigo,fecha,comentarios,tipo,presentacion from produccion';

    //Se realiza la consulta, recibiendo por parametro filas los registros de la base de datos.
    conexion.query(sql, function (error, filas) {
        if (error) {
            console.log('error en el listado');
            respuesta.write(null);
            respuesta.end();
            return;
        }else{
          var res='[';
          if(filas.length > 0){
            for(var i=0;i<filas.length;i++){
              res+='{';
              res+='"codigo":"'+filas[i].codigo+'",';
              res+='"fecha":"'+filas[i].fecha+'",';
              res+='"descripcion":"'+filas[i].comentarios+'",';
              res+='"tipo":"'+filas[i].tipo+'",';
              res+='"presentacion":"'+filas[i].presentacion+'"},';
            }
            res=res.slice(0,-1);  
          }          
          res+=']';
          console.log(res);
          respuesta.write(res);
          respuesta.end();
        }
    });
}

function editarCerveza(pedido,respuesta) {
  var info = '';
  pedido.on('data', function (datosparciales) {
      info += datosparciales;
  });
  pedido.on('end', function () {
      var datos = querystring.parse(info);

      var sql = "update tipocerveza  set nombre='"+datos['nombre']+"',descripcion='"+datos['descripcion']+"',porcentaje_alcohol='"+datos['porcentaje_alcohol']+"' where nombre=?";
      console.log(sql);
      conexion.query(sql, datos['nombre'],function (error, resultado) {
          if (error) {
            console.log("error");
              console.log('error en la consulta');
              respuesta.write('{"exito":"error"}');
              respuesta.end();
          }else{
            console.log(resultado.affectedRows);
            if(resultado.affectedRows>0){

              respuesta.write('{"exito":true}');
              respuesta.end();
            }else{
              respuesta.write('{"exito":false}');
              respuesta.end();
            }

          }
        });
  });
}

function editarPresentacion(pedido,respuesta) {
  var info = '';
  pedido.on('data', function (datosparciales) {
      info += datosparciales;
  });
  pedido.on('end', function () {
      var datos = querystring.parse(info);

      var sql = "update presentacion  set ml="+datos['ml']+",valor="+datos['valor']+" where ml=?";
      console.log(sql);
      conexion.query(sql, datos['ml'],function (error, resultado) {
          if (error) {
            console.log("error");
              console.log('error en la consulta');
              respuesta.write('{"exito":"error"}');
              respuesta.end();
          }else{
            console.log(resultado.affectedRows);
            if(resultado.affectedRows>0){

              respuesta.write('{"exito":true}');
              respuesta.end();
            }else{
              respuesta.write('{"exito":false}');
              respuesta.end();
            }

          }
        });
  });
}

function editarProduccion(pedido,respuesta) {
  var info = '';
  pedido.on('data', function (datosparciales) {
      info += datosparciales;
  });
  pedido.on('end', function () {
      var datos = querystring.parse(info);

      var sql = "update produccion  set codigo="+datos['codigo']+", fecha='"+datos['fecha']+"', comentarios='"+datos['descripcion']+
        "', tipo='"+datos['tipo']+"', presentacion="+datos['presentacion']+" where codigo=?";
      console.log(sql);
      conexion.query(sql, datos['codigo'],function (error, resultado) {
          if (error) {
            console.log("error");
              console.log('error en la consulta');
              respuesta.write('{"exito":"error"}');
              respuesta.end();
          }else{
            console.log(resultado.affectedRows);
            if(resultado.affectedRows>0){

              respuesta.write('{"exito":true}');
              respuesta.end();
            }else{
              respuesta.write('{"exito":false}');
              respuesta.end();
            }

          }
        });
  });
}

function eliminarCerveza(pedido, respuesta) {
    var info = '';
    pedido.on('data', function (datosparciales) {
        info += datosparciales;
    });
    pedido.on('end', function () {
        var datos = querystring.parse(info);
        var nombre = [datos['nombre']];
        var sql = 'delete from tipocerveza  where nombre=?';
        conexion.query(sql, nombre, function (error, resultado) {
            if (error) {
                console.log('error en la consulta');
                console.log(resultado.affectedRows);
                respuesta.write('{"exito":"error"}');
                respuesta.end();
            }else{
              console.log(resultado.affectedRows);
              if(resultado.affectedRows>0){
                respuesta.write('{"exito":true}');
                respuesta.end();
              }else{
                respuesta.write('{"exito":false}');
                respuesta.end();
              }

            }

        });
    });
}

function eliminarPresentacion(pedido, respuesta) {
    var info = '';
    pedido.on('data', function (datosparciales) {
        info += datosparciales;
    });
    pedido.on('end', function () {
        var datos = querystring.parse(info);
        var ml = [datos['ml']];
        var sql = 'delete from presentacion  where ml=?';
        conexion.query(sql, ml, function (error, resultado) {
            if (error) {
                console.log('error en la consulta');
                console.log(resultado.affectedRows);
                respuesta.write('{"exito":"error"}');
                respuesta.end();
            }else{
              console.log(resultado.affectedRows);
              if(resultado.affectedRows>0){
                respuesta.write('{"exito":true}');
                respuesta.end();
              }else{
                respuesta.write('{"exito":false}');
                respuesta.end();
              }

            }

        });
    });
}

function eliminarProduccion(pedido, respuesta) {
    var info = '';
    pedido.on('data', function (datosparciales) {
        info += datosparciales;
    });
    pedido.on('end', function () {
        var datos = querystring.parse(info);
        var codigo = [datos['codigo']];
        var sql = 'delete from produccion  where codigo=?';
        conexion.query(sql, codigo, function (error, resultado) {
            if (error) {
                console.log('error en la consulta');
                console.log(resultado.affectedRows);
                respuesta.write('{"exito":"error"}');
                respuesta.end();
            }else{
              console.log(resultado.affectedRows);
              if(resultado.affectedRows>0){
                respuesta.write('{"exito":true}');
                respuesta.end();
              }else{
                respuesta.write('{"exito":false}');
                respuesta.end();
              }

            }

        });
    });
}

//Habilita a las funciones para que sean llamadas o exportadas desde otros archivos
exports.conectardb = conectardb;
exports.crear = crear;
exports.crearPresentacion=crearPresentacion;
exports.crearProduccion=crearProduccion;
exports.eliminarCerveza=eliminarCerveza;
exports.eliminarPresentacion=eliminarPresentacion;
exports.eliminarProduccion=eliminarProduccion;
exports.editarCerveza=editarCerveza;
exports.editarPresentacion=editarPresentacion;
exports.editarProduccion=editarProduccion;
exports.listarCervezas=listarCervezas;
exports.listarPresentaciones=listarPresentaciones;
exports.listarProducciones=listarProducciones;
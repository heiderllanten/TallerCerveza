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
        database: 'proyectocerveza'
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
          for(var i=0;i<filas.length;i++){
            res+='{';
            res+='"nombre":"'+filas[i].nombre+'",';
            res+='"descripcion":"'+filas[i].descripcion+'",';
            res+='"porcentaje_alcohol":"'+filas[i].porcentaje_alcohol+'"},';
          }
          res=res.slice(0,-1);
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
function consulta(pedido, respuesta) {

    //Se obtienen datos
    var info = '';

    pedido.on('data', function (datosparciales) {
        info += datosparciales;
    });

    pedido.on('end', function () {

        //Se obtiene el codigo
        var datos = querystring.parse(info);

        var codigo = [datos['codigo']];
        //Se manda el codigo en la busqueda

        var sql = 'select descripcion,precio from articulos where codigo=?';

        conexion.query(sql, codigo, function (error, filas) {
            if (error) {
                console.log('error en la consulta');
                return;
            }
            //Se responde
            respuesta.writeHead(200, {'Content-Type': 'text/html'});
            //Se lee el registro obtenido y se sacan sus datos
            var datos = '';
            if (filas.length > 0) {
                datos += 'Descripcion:' + filas[0].descripcion + '<br>';
                datos += 'Precio:' + filas[0].precio + '<hr>';
            } else {
                datos = 'No existe un art�culo con dicho codigo.';
            }

            //Se responde
            respuesta.write('<!doctype html><html><head></head><body>');
            respuesta.write(datos);
            respuesta.write('<a href="index.html">Retornar</a>');
            respuesta.write('</body></html>');
            respuesta.end();
        });
    });
}



//Habilita a las funciones para que sean llamadas o exportadas desde otros archivos
exports.conectardb = conectardb;
exports.crear = crear;
exports.eliminarCerveza=eliminarCerveza;
exports.editarCerveza=editarCerveza;
exports.listarCervezas=listarCervezas;
exports.consulta = consulta;

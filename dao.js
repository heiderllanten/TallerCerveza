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



//Crear tabla
function crear(pedido,respuesta) {
  var info = '';

  pedido.on('data', function (datosparciales) {
      info += datosparciales;
  });
  pedido.on('end', function () {

      //Se obtiene el codigo
      var datos = querystring.parse(info);


      var registro = {
          nombre: datos['nombre'],
          descripcion: datos['descripcion'],
          porcentaje_alcohol: datos['porcentaje_alcohol']
      };
      var sql = 'insert into tipocerveza set ?';

      conexion.query(sql, registro, function (error, respuesta) {
          if (error) {
              console.log('error en la consulta');
              return;
          }


          respuesta.writeHead(200, {'Content-Type': 'text/html'});
          respuesta.write('<!doctype html><html><head></head><body>' +
                  'La Cerveza Ha sido registrada><a href="index.html">Retornar</a></body></html>');
          respuesta.end();
      });
  });


}

//Almacenar un registro
function alta(pedido, respuesta) {

    //Se obtienen los datos que se enviaron por post
    var info = '';

    pedido.on('data', function (datosparciales) {
        info += datosparciales;
    });

    //Cuando termina de capturar y pasar los datos a JSON

    pedido.on('end', function () {

        var datos = querystring.parse(info);
        //Se crea un objeto con la informacion capturada
        var registro = {
            descripcion: datos['descripcion'],
            precio: datos['precio']
        };

        var sql = 'insert into articulos set ?';

        //Se hace un insert mandado el objet completo
        conexion.query(sql, registro, function (error, resultado) {
            if (error) {
                console.log(error);
                return;
            }
        });
        //Se responde al usuario
        respuesta.writeHead(200, {'Content-Type': 'text/html'});
        respuesta.write('<!doctype html><html><head></head><body>' +
                'Se cargo el articulo<br><a href="index.html">Retornar</a></body></html>');
        respuesta.end();
    });
}


function listado(respuesta) {

    var sql = 'select codigo,descripcion,precio from articulos';

    //Se realiza la consulta, recibiendo por parametro filas los registros de la base de datos.
    conexion.query(sql, function (error, filas) {
        if (error) {
            console.log('error en el listado');
            return;
        }
        respuesta.writeHead(200, {'Content-Type': 'text/html'});
        //Se recorren los registros obtenidos
        var datos = '';
        for (var f = 0; f < filas.length; f++) {
            datos += 'Codigo:' + filas[f].codigo + '<br>';
            datos += 'Descripcion:' + filas[f].descripcion + '<br>';
            datos += 'Precio:' + filas[f].precio + '<hr>';
        }

        //Se responde
        respuesta.write('<!doctype html><html><head></head><body>');
        respuesta.write(datos);
        respuesta.write('<a href="index.html">Retornar</a>');
        respuesta.write('</body></html>');
        respuesta.end();
    });
}



function eliminar(pedido, respuesta) {

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

        var sql = 'delete from articulos  where codigo=?';

        conexion.query(sql, codigo, function (error, respuesta) {
            if (error) {
                console.log('error en la consulta');
                return;
            }


            console.log(respuesta.affectedRows);
            //Se responde
            respuesta.writeHead(200, {'Content-Type': 'text/html'});
            //Se lee el registro obtenido y se sacan sus datos
            var datos = '';






            // if (respuesta.affectedRows >= 1) {
            //     datos = 'No existe un art�culo con dicho codigo.';
            // } else {
            //     datos = 'No existe un art�culo con dicho codigo.';
            // }
            //Se responde
            respuesta.write('<!doctype html><html><head></head><body>');
            respuesta.write(datos);
            respuesta.write('<a href="index.html">Retornar</a>');
            respuesta.write('</body></html>');
            respuesta.end();
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
exports.alta = alta;
exports.listado = listado;
exports.consulta = consulta;
exports.eliminar = eliminar;

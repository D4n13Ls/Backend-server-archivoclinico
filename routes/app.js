// Ruta principal de la aplicacion


// importando librerias
var express = require('express');

//inicializando express
var app = express();


//Ruta principal
app.get('/', (req, res, next )=>{

    res.status(200).json({

      ok: true,
      mensaje: 'Peticion realizada exitosamente'

    });
});

module.exports = app;
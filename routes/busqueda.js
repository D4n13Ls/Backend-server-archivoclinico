// importando librerias
var express = require('express');

//inicializando express
var app = express();

var Hospital = require("../models/hospital"); 

//Ruta principal
app.get('/todo/:busqueda', (req, res, next )=>{

    var busqueda = req.param.busqueda;


    

    res.status(200).json({

      ok: true,
      mensaje: 'Peticion realizada exitosamente'

    });
});

module.exports = app;
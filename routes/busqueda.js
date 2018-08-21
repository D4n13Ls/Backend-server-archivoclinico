// importando librerias
var express = require('express');

//inicializando express
var app = express();

var Hospital = require("../models/hospital"); 
var Usuario = require("../models/usuario");
var Medico = require("../models/medico");


//Ruta principal
app.get('/todo/:busqueda', (req, res, next )=>{

    var busqueda = req.params.busqueda;
    //expresion regular de busqueda
    var regex = new RegExp( busqueda, 'i');

    Promise.all([
      busquedaDeHospital(busqueda, regex),
      busquedaDeMedicos(busqueda, regex),
      busquedaDeUsuarios(busqueda, regex)
    ]).then(respuestas =>{

      res.status(200).json({
    
        ok: true,
        hospitales: respuestas[0],
        medicos: respuestas[1],
        usuarios: respuestas[2]
    
      });

    });

});


//funcion de busqueda de hospitales
  function busquedaDeHospital( busqueda, regex){

    return new Promise( (resolve, reject) =>{

      Hospital.find({nombre: regex }, (err, hospitales)=>{

        if(err){
          reject('error al cargar la busqueda', err);
        }else{
          resolve(hospitales); 
        }
      }).limit(3);
   });

  }


  //funcion de busqueda para medicos
  function busquedaDeMedicos( busqueda, regex){

    return new Promise( (resolve, reject) =>{

      Medico.find({nombre: regex }, (err, medicos)=>{

        if(err){
          reject('error al cargar la busqueda', err);
        }else{
          resolve(medicos); 
        }
      }).limit(3);
   });

  }


  function busquedaDeUsuarios( busqueda, regex){

    return new Promise( (resolve, reject) =>{

      Usuario.find({}, 'nombre apellido_p apellido_m correo_electronico, img' )
      .or({nombre: regex }, (err, usuarios)=>{
        if(err){
          reject('error al cargar la busqueda', err);
        }else{
          resolve(usuarios); 
        }
      }).limit(3);
   });

  }
  
module.exports = app;
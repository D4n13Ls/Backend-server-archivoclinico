//libreria para poder utilizar express
var express = require('express');
//libreria de encriptacion de contraseñas de una sola via
var bcrypt = require('bcryptjs');
//libreria necesaria para poder crear un token
var jwt = require('jsonwebtoken');




//Inicializacion de variable para uso de express
var app = express();
//importacion de objeto de usuario
var Usuario = require('../models/usuario');
//archivo de configuracion
var seed = require('../config/config').seed;



/*********************************/  
// LOGIN DE USUARIO
/*********************************/  
app.post('/', (req, res)=>{

    var body = req.body;

    Usuario.findOne({correo_electronico: body.correo_electronico},(err, usuarioDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'usuario no encontardo en la base de datos',
                errors: err,

            });
        }

        // comparacion de email proporcionado por usuario con el de base de datos
        if(!usuarioDB){
            return res.status(401).json({
                ok: false,
                mensaje: 'credenciales de correo electronico incorrectas ~ correo_electronico',
                errors: err,

            });
        }

        // comparacion de password proporcionado con el encriptado de la base de datos
        if(!bcrypt.compareSync(body.contrasena, usuarioDB.contrasena)){
            return res.status(400).json({
                ok:false,
                mensaje: 'credenciales de contraseña incorrectas ~ contrasena',
                errors: err
            });
        }

        // CREACION DE UN TOKEN DE USUARIO
        usuarioDB.contrasena = ':)'; // se iguala la contraseña proporcionada a este codigo para no enviar la original por medio del token
        var token = jwt.sign({usuario: usuarioDB}, seed ,{expiresIn: 14400}); // se crea el token con limite de session 

        res.status(200).json({
            ok: true,
            mensaje: 'usuario autenticado correctamente',
            Usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });

    })


   
});

module.exports = app;
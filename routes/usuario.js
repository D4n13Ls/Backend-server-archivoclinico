//importando librerias
var express = require('express');
var bcrypt = require('bcryptjs');
//libreria necesaria para poder crear un token
var jwt = require('jsonwebtoken');
// importando middlewares
var mdautentificacion = require('../middlewares/autenticacion');



//inicializando variables

var app = express();

var Usuario = require('../models/usuario');
//archivo de configuracion
var seed = require('../config/config').seed;



//Ruta principal
app.get('/', (req, res, next) => {

    /*********************************/
    //OBTENER USUARIOS
    //BUSCA EN LA BASE DE DATOS 
    /*********************************/

//variable (desde) define la busqueda en la paginacion 
var desde = req.query.desde || 0; // se crea una variable que nos dira desde donde de ara la busqueda
desde = Number(desde); //convierte la variable desde a formato numero

    Usuario.find({}, 'id nombre apellido_p apellido_m correo_electronico rol')

        .skip(desde) // funcion de moongose que realiza un salto en la busqueda de acurdo al valor de la varible desde
        .limit(3) // funcion de moongose nos devuelve solo 5 registros de la coleccion de usuarios de la base de datos
        .exec( // funcion de moongose ejecuta con esta linea de codigo, la busqueda de find
            (err, usuarios) => {

                //si la busqueda dentro de la base de datos falla, arrojara un error con status 500
                if (err) {
                    return
                    res.status(500).json({
                        ok: false,
                        mensaje: 'base de datos usuarios no encontrada',
                        errors: err

                    });
                }

                // en caso contrario arrojara un 200 y el objeto de la base de datos
                res.status(200).json({

                    ok: true,
                    usuarios: usuarios

                });

            })

});


/*********************************/
//ACTUALIZAR USUARIO
/*********************************/
app.put('/:id', mdautentificacion.verificaToken ,(req, res, next) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Usuario no actualizado',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario con ' + id + 'no actualizado',
                errors: { message: 'el suario no existe' }
            });
        }

        usuario.nombre = body.nombre,
            usuario.apellido_p = body.apellido_p,
            usuario.apellido_m = body.apellido_m,
            usuario.correo_electronico = body.correo_electronico,
            usuario.contrasena = bcrypt.hashSync(body.contrasena, 10),
            usuario.img = body.img,
            usuario.rol = body.rol

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'usuario no actualizado correctamente, problemas con la base de datos, o datos no validos',
                    errors: err

                });
            }

            res.status(200).json({

                ok: true,
                usuario: usuarioGuardado,
                usuarioToken: req.usuario
            });

        })


    })


});


/*********************************/
// CREAR NUEVOS USUARIOS
/*********************************/
app.post('/', mdautentificacion.verificaToken , (req, res, next) => {

    // con libreria body-parser se crea -> se instala dentro del proyecto con npm install body-parser --save

    var body = req.body; //funciona solamente si existe instalado body parser


    // crea un nuevo objeto de usuario de Usuario.js models
    var usuario = new Usuario({
        nombre: body.nombre,
        apellido_p: body.apellido_p,
        apellido_m: body.apellido_m,
        correo_electronico: body.correo_electronico,
        contrasena: bcrypt.hashSync(body.contrasena, 10),
        img: body.img,
        rol: body.rol

    });

    // se guarda en la base de datos
    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'usuario no guardado correctamente, problemas con la base de datos',
                errors: err

            });
        }

        res.status(201).json({

            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });


    });




});

/*********************************/
// ELIMINAR USUARIO ESPECIFICO
/*********************************/
app.delete('/:id', mdautentificacion.verificaToken ,(req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'usuario no encontrado',
                errors: err

            });
        }

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                message: 'no existe un usuario con el id ' + id,
                errors: { message: 'no existe el usuario con el ' + id }
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'usuario eliminado exitosamente',
            usuario: usuarioEliminado,
            usuarioToken: req.usuario
        });
    })


});


module.exports = app;
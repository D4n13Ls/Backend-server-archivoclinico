//importando librerias
var express = require('express');


// importando middlewares
var mdautentificacion = require('../middlewares/autenticacion');



//inicializando variables

var app = express();

var Hospital = require('../models/hospital');
//archivo de configuracion
var seed = require('../config/config').seed;



//Ruta principal
app.get('/', (req, res, next) => {

    /*********************************/
    //OBTENER HOSPITALES
    //BUSCA EN LA BASE DE DATOS 
    /*********************************/
    Hospital.find({})
        .populate('usuario', 'nombre correo_electronico')
        .exec( //ejecuta con esta linea de codigo, la busqueda de find
            (err, hospitales) => {

                //si la busqueda dentro de la base de datos falla, arrojara un status 500
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'base de datos hospitales no encontrada',
                        errors: err

                    });
                }

                // en caso contrario arrojara un 200 y el objeto de la base de datos
                 res.status(200).json({

                    ok: true,
                    hospitales: hospitales

                });
                
            })

});


/*********************************/
//ACTUALIZAR HOSPITAL
/*********************************/
app.put('/:id', mdautentificacion.verificaToken ,(req, res, next) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospitales) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Hospital no actualizado',
                errors: err
            });
        }

        if (!hospitales) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Hospital con ' + id + 'no actualizado',
                errors: { message: 'el hospital no existe' }
            });
        }

            hospitales.nombre = body.nombre,
            hospitales.direccion = body.direccion,
            hospitales.institucion_perteneciente = body.institucion_perteneciente,
            hospitales.tipo_de_institucion = body.tipo_de_institucion,
            hospitales.img = body.img,
            hospitales.usuario = req.usuario._id

        hospitales.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'hospital no actualizado correctamente, problemas con la base de datos, o datos no validos',
                    errors: err

                });
            }

            res.status(200).json({

                ok: true,
                hospital: hospitalGuardado,
                usuarioToken: req.usuario
            });

        })


    })


});


/*********************************/
// CREAR NUEVOS HOSPITALES
/*********************************/
app.post('/', mdautentificacion.verificaToken , (req, res, next) => {

    // con libreria body-parser se crea -> se instala dentro del proyecto con npm install body-parser --save

    var body = req.body; //funciona solamente si existe instalado body parser


    // crea un nuevo objeto de hospital de hospital.js models
    var hospital = new Hospital({
        nombre: body.nombre,
        direccion: body.direccion,
        institucion_perteneciente: body.institucion_perteneciente,
        tipo_de_institucion: body.tipo_de_institucion,
        img: body.img,
        usuario: req.usuario._id

    });

    // se guarda en la base de datos
    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'usuario no guardado correctamente, problemas con la base de datos',
                errors: err

            });
        }

        res.status(201).json({

            ok: true,
            hospital: hospitalGuardado,
            usuarioToken: req.usuario
        });


    });




});

/*********************************/
// ELIMINAR HOSPITAL ESPECIFICO
/*********************************/
app.delete('/:id', mdautentificacion.verificaToken ,(req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalEliminado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'hospital no encontrado',
                errors: err

            });
        }

        if (!hospitalEliminado) {
            return res.status(400).json({
                ok: false,
                message: 'no existe un hospital con el id ' + id,
                errors: { message: 'no existe el hospital con el ' + id }
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'usuario eliminado exitosamente',
            hospital: hospitalEliminado,
            usuarioToken: req.usuario
        });
    })


});


module.exports = app;
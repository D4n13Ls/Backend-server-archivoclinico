//importando librerias
var express = require('express');

// importando middlewares
var mdautentificacion = require('../middlewares/autenticacion');



//inicializando variables

var app = express();

var Medico = require('../models/medico');
//archivo de configuracion
var seed = require('../config/config').seed;



//Ruta principal
app.get('/', (req, res, next) => {

    /*********************************/
    //OBTENER MEDICOS
    //BUSCA EN LA BASE DE DATOS 
var desde = req.query.desde || 0; // se crea una variable que nos dira desde donde de ara la busqueda
desde = Number(desde);/*********************************/

    Medico.find({})
        .skip(desde)
        .limit(3)
        //los populate regresan informacion(data)de una coleccion especifica de la base de datos que deceemos
        .populate('hospital') 
        .populate('usuario', 'nombre correo_electronico')
        .exec( //ejecuta con esta linea de codigo, la busqueda de find
            (err, medicos) => {

                //si la busqueda dentro de la base de datos falla, arrojara un status 500
                if (err) {
                    return
                    res.status(500).json({
                        ok: false,
                        mensaje: 'base de datos medicos no encontrada',
                        errors: err

                    });
                }

                Medico.count({}, (err, conteo) =>{

                    // en caso contrario arrojara un 200 y el objeto de la base de datos
                    res.status(200).json({
                        
                        ok: true,
                        mensaje: medicos,
                        Total: conteo
                    });
                })
                
            })

});


/*********************************/
//ACTUALIZAR MEDICO
/*********************************/
app.put('/:id', mdautentificacion.verificaToken ,(req, res, next) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Medico no actualizado',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Medico con ' + id + 'no actualizado',
                errors: { message: 'el medico no existe' }
            });
        }

            medico.nombre = body.nombre;
            medico.apellido_p = body.apellido_p,
            medico.apellido_m = body.apellido_m,
            medico.correo_electronico = body.correo_electronico,
            medico.direccion = body.direccion,
            medico.telefono = body.telefono,
            medico.celular = body.celular,
            medico.img = body.img,
            medico.resena = body.resena,
            medico.usuario = req.usuario._id;
            medico.hospital = body.hospital;
            

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'medico no actualizado correctamente, problemas con la base de datos, o datos no validos',
                    errors: err

                });
            }

            res.status(200).json({

                ok: true,
                medico: medicoGuardado,
                usuarioToken: req.usuario
            });

        })


    })


});


/*********************************/
// CREAR NUEVOS MEDICOS
/*********************************/
app.post('/', mdautentificacion.verificaToken , (req, res, next) => {

    // con libreria body-parser se crea -> se instala dentro del proyecto con npm install body-parser --save

    var body = req.body; //funciona solamente si existe instalado body parser


    // crea un nuevo objeto de medico de medico.js models
    var medico = new Medico({
        nombre:  body.nombre,
        apellido_p: body.apellido_p,
        apellido_m: body.apellido_m,
        correo_electronico: body.correo_electronico,
        direccion: body.direccion,
        telefono: body.telefono,
        celular: body.celular,
        img: body.img,
        resena: body.resena,
        usuario: req.usuario._id,
        hospital: body.hospital

    });

    // se guarda en la base de datos
    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'medico no guardado correctamente, problemas con la base de datos',
                errors: err

            });
        }

        res.status(201).json({

            ok: true,
            medico: medicoGuardado,
            usuarioToken: req.usuario
        });


    });




});

/*********************************/
// ELIMINAR HOSPITAL ESPECIFICO
/*********************************/
app.delete('/:id', mdautentificacion.verificaToken ,(req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoEliminado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'medico no encontrado',
                errors: err

            });
        }

        if (!medicoEliminado) {
            return res.status(400).json({
                ok: false,
                message: 'no existe un medico con el id ' + id,
                errors: { message: 'no existe el medico con el ' + id }
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'usuario eliminado exitosamente',
            medico: medicoEliminado,
            usuarioToken: req.usuario
        });
    })


});


module.exports = app;
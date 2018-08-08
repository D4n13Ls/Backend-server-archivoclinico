var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema; // define un esquemas o campos se crearan para las collecciones de mongo

var rolesValidosdeUsuarios = {
    values: ['ADMIN_ROLE', 'USUARIO_ROLE'],
    message: '{VALUE} no esta permitido'
}

//FUNCION QUE CREA UN OBJETO Y RESIVE PARAMETROS DE JAVASCRIPT CON CONFIGURACION QUE QUEREMOS REALIZAR PARA EL SCHEMA
var usuarioSchema = new Schema({

    nombre: {type: String, required: [true, 'Nombre de usuario obligatorio']},
    apellido_p: {type: String, required: [true, 'Apellido paterno es obligatorio']},
    apellido_m: {type: String, required: [true, 'Apellido materno es obligatorio']},
    correo_electronico: {type: String, unique:true, required: [true, 'Correo electronico es obligatorio']},
    contrasena: {type: String, required: [true, 'Es necesario que proporcione una contraseña de usuario']},
    img: {type: String, required: false},
    rol: {type: String, required: true, default: 'USER_ROLE', enum: rolesValidosdeUsuarios},

});

//realizando validaciones con mongoose validator
usuarioSchema.plugin(uniqueValidator, {message:'el {PATH} debe ser unico'});

//exporta el objeto de la funcion usuarioSchema
module.exports = mongoose.model('Usuario', usuarioSchema);
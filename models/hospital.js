var mongoose = require("mongoose");

var Schema = mongoose.Schema; // define un esquemas o campos se crearan para las collecciones de mongo


//FUNCION QUE CREA UN OBJETO Y RESIVE PARAMETROS DE JAVASCRIPT CON CONFIGURACION QUE QUEREMOS REALIZAR PARA EL SCHEMA
var hospitalSchema = new Schema({

    nombre: {type: String, required: [true, 'Nombre de hospital obligatorio']},
    direccion: {type: String, required: [true, 'Apellido paterno es obligatorio']},
    institucion_perteneciente: {type: String, required: [true, 'Apellido materno es obligatorio']},
    tipo_de_institucion:{type: String, required: [true, 'Tipo de institucion es requerido']},
    img: {type: String, required: false},
    usuario: {	type: Schema.Types.ObjectId,	ref: 'Usuario' }

},	{	collection: 'hospitales' });


//exporta el objeto de la funcion usuarioSchema
module.exports = mongoose.model('hospital', hospitalSchema);
var mongoose = require("mongoose");

var Schema = mongoose.Schema; // define un esquemas o campos se crearan para las collecciones de mongo

var medicoSchema =	new Schema({
				nombre: {	type: String,	required: [true, 'El nombre	es	necesario']	},
				apellido_p:{ type: String, required:[ true, 'El apellido paterno es necesario']},
				apellido_m:{type: String, required:[ true, 'El apellido materno es necesario']},
				correo_electronico:{type: String, required:[ true, 'El correo electronico es necesario']},
				direccion:{type: String, required:[ true, 'La direccion es necesaria']},
				telefono:{type: Number, required:[ true, 'El telefono es necesario']},
				celular:{type: Number, required:[ true, 'Tu numero celular es necesario']},
				img: {	type: String,	required: false },
				resena: { type: String, required:[true, 'Escribe una reseña de tu experiencia para dar mayor informacion sobre ti al paciente']},
				usuario: {	type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
                hospital: {	type: Schema.Types.ObjectId, ref: 'Hospital', required: [true,'El	id	hospital es un	campo	obligatorio']}
});
module.exports =	mongoose.model('Medico',	medicoSchema);
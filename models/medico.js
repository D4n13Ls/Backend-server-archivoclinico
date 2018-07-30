var mongoose = require("mongoose");

var Schema = mongoose.Schema; // define un esquemas o campos se crearan para las collecciones de mongo

var medicoSchema =	new Schema({
				nombre: {	type: String,	required: [true, 'El nombre	es	necesario']	},
				img: {	type: String,	required: false },
				usuario: {	type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
                hospital: {	type: Schema.Types.ObjectId, ref: 'Hospital', required: [true,'El	id	hospital es un	campo	obligatorio']}
});
module.exports =	mongoose.model('medico',	medicoSchema);
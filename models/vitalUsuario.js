var moongose = require("mongoose");

var Schema = moongose.Schema;

var vitalSchema = new Schema({

    estatura: { type: String, required:[true, 'La estatura es necesaria']},
    peso: {type: String, required:[true, 'El peso es necesaria']},
    talla: {type: String, required:[true, 'La talla es necesaria']},
    tipo_sangre: {type: String, required:[true, 'El tipo de sangre es obligatorio']},
    temperatura:{type: String, required:[true, 'La temperatura es necesaria']},
    ritmo_cardiaco:{type: String, required:[true, 'El ritmo cardiaco es necesario']}

 
})

module.exports = moongose.model('VitalUsuario', vitalSchema );
//libreria necesaria para poder crear un token
var jwt = require('jsonwebtoken');


//importando archivo de configuracion
var seed = require('../config/config').seed;


/*********************************/
// midelware DE VERIFICACION DE TOKEN DE USUARIO 
/*********************************/

// con esta funcion de midelware, apartir de esta linea de codigo... todo requiere autorizacion para usarlo
//mandando token atravez de la url 

exports.verificaToken = function(req, res, next){

    var token = req.query.token;

    jwt.verify(token, seed, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'token incorrecto, error de autenticacion',
                errors: err
            });
        }

        req.usuario = decoded.usuario;// guardando datos de usuario en el parametro decoded para enviarlos atravez del token
        next(); // si la autentificacion es valida esta linea indica que permite continuar con las funciones que proceden despues, 
        

    })
}


    
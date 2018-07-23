// Requerimientos necesarios

var express = require('express'); //referencia a libreria express
var mongoose = require('mongoose'); //referencia a libreria mongoose
var  bodyParser  = require('body-parser');




//Inicializando variables

var app = express();

// Body-parser
//  parse application / x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : false }))
app.use(bodyParser.json())

//rutas importadas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital'); 
var loginRoutes = require('./routes/login');


//Conexion a la base de datos mongodb con mongoose

mongoose.connection.openUri('mongodb://localhost:27017/archivoClinicodb', (err, res) =>{

    if(err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});


// referencia de Rutas importadas mejor conocidas como midelwer

app.use('/hospital', hospitalRoutes);
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);


// Escuchar peticiones

// La variable app se inicializara en el puerto 3000
app.listen(3000, () =>{
    console.log('Servidor expres corriendo en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})
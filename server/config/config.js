//==================
// Puerto
//==================
process.env.PORT = process.env.PORT || 3000;

//==================
// Entorno
//==================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; //verificar si estamos en produccion
//==================
// Vencimiento del token
//==================
//60 segundos
//60 minutos
//24 horas
//30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//==================
// SEED de autenticacion
//==================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
//==================
// Base de Datos
//==================

let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//==========================
// Google Client ID
//==========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '989610121920-12l28rjv5va734pa5bsljj6310448jlo.apps.googleusercontent.com';
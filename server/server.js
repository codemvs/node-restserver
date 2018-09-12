require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();


app.use(require('./routes/usuario'));

//connecto mongodb
mongoose.connect(process.env.URLDB,(err)=>{
    if(err) throw err;

    console.log('Base de datos online');
});
app.listen(process.env.PORT,()=>{
    console.log(`Escuchando el puerto ${process.env.PORT}`);
    
})
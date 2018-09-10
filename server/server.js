require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

app.use(require('./routes/usuario'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended:false }));
//parse application/json
app.use(bodyParser.json());




//eliminar - cambiar de estado
app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    })
});

//connecto mongodb
mongoose.connect('mongodb://localhost:27017/cafe',(err)=>{
    if(err) throw err;

    console.log('Base de datos online');
});
app.listen(process.env.PORT,()=>{
    console.log(`Escuchando el puerto ${process.env.PORT}`);
    
})
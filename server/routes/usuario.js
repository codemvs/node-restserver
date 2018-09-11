const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

// Obtener registros
app.get('/usuario', (req, res) => {
    res.json('get usuario Local')
});
//crear nuevos registros
app.post('/usuario', (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre:body.nombre,
        email:body.email,
        password: bcrypt.hashSync(body.password,10),
        role:body.role
    });

    usuario.save((err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }        
        res.json({
            ok:true,
            usuario:usuarioDB
        });
    });

});

//actualizar 
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    })
});

//eliminar - cambiar de estado
app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    })
});


module.exports=app;
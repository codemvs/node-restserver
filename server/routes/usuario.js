const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

// Obtener registros
app.get('/usuario', (req, res) => {
    let desde = req.query.desde || 0;
    let limite = req.query.limite|| 5;
    desde = Number(desde);
    limite = Number(limite);
    let confSearch={estado:true};
    Usuario.find(confSearch,'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec((err,usuarios)=>{
                if(err){
                    return res.status(400).json({
                        ok:false,
                        err
                    });
                }
                Usuario.count(confSearch,(err,conteo)=>{
                    res.json({
                        ok: true,
                        cuantos:conteo,
                        usuarios
                    })
                });
                
            })
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
        usuario.save((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        });    
});

//actualizar 
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','img',
        'role','estado']);
    
    Usuario.findByIdAndUpdate(id, body,{new:true,runValidators:true},(err, usuarioDB)=>{     
        
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

//eliminar - cambiar de estado
app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    
    let cambiaEstado = {
        estado:false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true, runValidators: true },(err, usuarioBorrado) => {
    //Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        if(!usuarioBorrado){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok:true,
            usuario:usuarioBorrado
        })
    });

});


module.exports=app;
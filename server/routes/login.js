const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//import library google sing_in
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

//import models
const Usuario = require('../models/usuario');

const app = express();

app.post('/login',(req,res)=>{
    let body = req.body;    
    Usuario.findOne({email:body.email},(err,usuarioDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if(!usuarioDB){
            return res.status(500).json({
                ok: false,
                err:{
                    message:'(usuario) o contraseña incorrectos'
                }
            });
        }
        //comparar contraseñas encriptadas
        
        if(!bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'usuario o (contraseña) incorrectos'
                }
            });
        }
        //crear token de session
        let token = jwt.sign({
            usuario:usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});
        res.json({
            ok:true,
            usuario:usuarioDB,
            token
        });
    });
});

//configuraciones de google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
   
   return {
       name:payload.name,
       email:payload.email,
       img:payload.picture,
       google:true
   }
   
   
}

//autenticacion google
app.post('/google',async (req, res) => {
    let token = req.body.idtoken;
    let googleUser =await verify(token)
        .catch(e=>{
            return res.status(403).json({
                ok:false,
                err:e
            });
        });
  
    //verificar si el usuairo ya existe en la base de datos.
    Usuario.findOne({email:googleUser.email},(err,usuarioDB)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(usuarioDB){
            // verificar si se autentico por google
            if(usuarioDB.google===false){
                return res.status(400).json({
                    ok: false,
                    err:{
                        message:'Debe de usar su autenticación normal'
                    }
                });
            }else{
                //renovar token
                let token = jwt.sign({
                    usuario:usuarioDB
                },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN});
                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token
                });
            }
        }else{
            //si el usuario no existe en la base de datos
            let usuairo = new Usuario();
            usuairo.nombre = googleUser.name;
            usuairo.email = googleUser.email;
            usuairo.img = googleUser.img;
            usuairo.google = true;
            usuairo.password = ':)';

            usuairo.save((err,usuarioDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                }
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });
});


module.exports=app;
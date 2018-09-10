require('./config/config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended:false }));
//parse application/json
app.use(bodyParser.json());


// Obtener registros
app.get('/usuario',(req,res)=>{
    res.json('get usuario')
});
//crear nuevos registros
app.post('/usuario', (req, res) => {
    let body=req.body;
    if(body.nombre===undefined){
        res.status(400).json({
            ok:false,
            mensaje:"El nombre es necesario"
        });
    }else{
        res.json({
            persona: body
        });
    }
    
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


app.listen(process.env.PORT,()=>{
    console.log(`Escuchando el puerto ${process.env.PORT}`);
    
})
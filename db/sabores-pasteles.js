const mongoose = require('mongoose');

const saboresSchema = new mongoose.Schema({
    
   
    nombre_sabor    : { type: String, required: true },
    categoria_sabor : {type:String,required: true},
    descripcion     : {type:String, required: true},
    estado          : {type: Boolean, required: true},
    
    
});

const Sabor = mongoose.model('Sabor', saboresSchema);

module.exports = Sabor;


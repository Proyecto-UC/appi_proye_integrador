const mongoose = require('mongoose');

const porcioneslSchama = new mongoose.Schema({
    
    diametro    :{type:String, required: true},
    porciones   :{type:String, required: true},
    estado      :{type:Boolean, required: true},
    
});

const porciones = mongoose.model('porciones', porcioneslSchama); 

module.exports = porciones; 
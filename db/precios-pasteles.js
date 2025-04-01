const mongoose = require('mongoose');

const precioSchama = new mongoose.Schema({
    
   
    producto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Productos', required: true },
    sabor_id: {  type: mongoose.Schema.Types.ObjectId, ref: 'Sabor', required: true },
    porciones:{type:String, required: true},
    precio:{type:String, required: true},
    
    
});

const Precio = mongoose.model('Precio', precioSchama); 

module.exports = Precio; 
const mongoose = require('mongoose');

const productosSchama = new mongoose.Schema({
    
    calificacione_id    : { type: mongoose.Schema.Types.ObjectId, ref: 'Calificacion'},
    nombre_producto     : {type:String, required: true},
    categoria           : {type:String, required: true},
    estado_producto     : {type: Boolean, required: true},
    descripcion         : {type:String, required: true},
    fecha_registro      : {type:Date, default:Date.now}
    
});

const Productos = mongoose.model('Productos', productosSchama); 

module.exports = Productos; 
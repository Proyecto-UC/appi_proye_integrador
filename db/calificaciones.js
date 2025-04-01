const mongoose = require('mongoose');

const calificacionesSchama = new mongoose.Schema({
    
   
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    producto_id: {  type: mongoose.Schema.Types.ObjectId, ref: 'Productos', required: true },
    descripcion:{type:String, required: true},
    calificacion:{type:String, required: true},
    
    
});

const Calificacion = mongoose.model('Calificacion', calificacionesSchama); 

module.exports = Calificacion; 
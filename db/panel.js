const mongoose = require('mongoose');

const panelSchama = new mongoose.Schema({
    
   
    multimedia_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Imagenes', required: true },
    nombre_p:{type:String, required: true},
    descripcion:{type:String, required: true},
    estado:{type:String, required: true},

 
    
});

const Panel = mongoose.model('panel', panelSchama); 

module.exports = Panel; 
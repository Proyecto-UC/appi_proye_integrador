const mongoose = require('mongoose');

const imagenesSchema = new mongoose.Schema({
    
    producto_id :{  type: mongoose.Schema.Types.ObjectId, ref: 'Productos' },
    url: { type:String},
    filename: { type:String},
    fechaSubida: { type: Date, default: Date.now },
});

const Imagenes = mongoose.model('Imagenes', imagenesSchema);

module.exports = Imagenes;

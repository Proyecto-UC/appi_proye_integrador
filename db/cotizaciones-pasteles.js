const mongoose = require('mongoose');

const cotizacionesSchama = new mongoose.Schema({
    
   
    userId         : {type:String},// pendiente implementar id
    productosId    : {  type: mongoose.Schema.Types.ObjectId, ref: 'Productos'},
    saboresId      : { type: mongoose.Schema.Types.ObjectId, ref: 'Sabor' },
    porcionesId    : { type: mongoose.Schema.Types.ObjectId, ref: 'Sabor' },
    fecha_registro : {type:Date, default:Date.now},
    fechaEvento    : {type:Date, required: true},
    descripcion    : {type:String, required: true},
    precio         : {type:String},
    estado         : {type:Boolean, required: true},
    
});

const Cotizaciones = mongoose.model('Cotizaciones', cotizacionesSchama); 

module.exports = Cotizaciones; 
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    rol: { type: String, required: true },
    nombre: { type: String },
    apellido: { type: String },
    telefono: { type: String },
    direccion: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    ciudad: { type: String },
    departamento: { type: String },
    estado: { type: String },
    password: { type: String, required: true },
    salt: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

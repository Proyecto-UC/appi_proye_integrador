const express = require('express');
const router = express.Router();
const controllers = require('./controllers/controller.js');
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router
    
    .post('/upload', upload.array('image',10), controllers.SubirImagenes)
    .post('/cotizacion', upload.array('image',10), controllers.subirCotizaciones)
    .post('/sabor', controllers.registroSabores)
    .post('/porciones', controllers.registroPorcioes)
    .get('/cotizacionuser/:userid', controllers.cotizacionUser)
    .get('/cotizacionall', controllers.cotizacionAll)
    .patch('/modificarcoti/:idcotizacion', controllers.cotizacionModificar)
    

module.exports = router;
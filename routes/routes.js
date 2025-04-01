const express = require('express');
const router = express.Router();
const controllers = require('./controllers/controller.js');
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router
    // .get('/', controller.getAllSignos)
    // .get('/:categoriaU/:signoU', signoController.getOneSigno)

    // .post('/codigo', signoController.registarCodigo)
    // .post('/registro', signoController.registroCredenciales)
    // .post('/login',signoController.validarCredenciales)
    // .post('/registroadmin',signoController.registarAdmin)
    // .get('/traer/:valor',signoController.ganadores)
    // .get('/traerusuario/:iduser',signoController.renderizar)
    // .post('/generar',signoController.generarCodigo)
    .post('/upload', upload.array('image',10), controllers.SubirImagenes)
    .post('/cotizacion', upload.array('image',10), controllers.subirCotizaciones)
    .post('/sabor', controllers.registroSabores)
    .post('/porciones', controllers.registroPorcioes)
    // .get('/videos',signoController.videos)
    // .get('/nombre',signoController.buscarvideos)
    // .patch('/restablecer', signoController.editarContrasena)

module.exports = router;
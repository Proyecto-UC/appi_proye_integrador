
const fs = require('fs/promises');
const path = require('path');
const moment = require('moment-timezone');
const bcrypt = require('bcrypt');
const AWS = require('@aws-sdk/client-s3');  // Correcto para AWS SDK v3
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');  // Importación correcta de AWS SDK v3
const s3Client = require('../../db/awsS3');  // Asegúrate de tener la conexión de AWS configurada correctamente
const User = require('../../db/user');


const imagenes = require('../../db/multimedia');
const producto = require('../../db/productos-pasteles')
const sabor    = require('../../db/sabores-pasteles')
const porcion= require('../../db/porciones')
const cotizacion = require('../../db/cotizaciones-pasteles');
const Sabor = require('../../db/sabores-pasteles');
const porciones = require('../../db/porciones');
const { error } = require('console');


const upload = multer({ storage: multer.memoryStorage()});

//---------------subir imagen al s3 -----------------------

const SubirImagenes = async ( req, res ) => {

    try {
        const Archivos  = req.files; // Accede al archivo subido
        const datos     = JSON.parse( req.body.data ); // Obtén el nuevo nombre desde el cliente
      
        if ( !Archivos || Archivos.length === 0 ) return res.status(400).json({ error: 'No se ha subido ningún archivo' });
        
        
        const { nombreProducto } = datos
        const Producto           = await registroProductos(datos);
        const id                 = Producto._id;
        const imagenesSubidas    = await subirS3(Archivos, id, nombreProducto);
        // Generar un nombre único para el archivo o usar el proporcionado por el cliente
       
        res.json({

            mensaje : 'Productos e imagenes subidas correctamente',
            Producto,
            imagenes: imagenesSubidas
            
        });
        
    } catch ( error ) {
      console.error('Error al subir el video:', error);
      res.status(500).json({ error: 'Error al subir el video' });
    }
};


const subirCotizaciones = async ( req, res ) => {

    try {
        const Archivos  = req.files; // Accede al archivo subido
        const datos     = JSON.parse( req.body.data ); // Obtén el nuevo nombre desde el cliente
      
        if ( !Archivos || Archivos.length === 0 ) return res.status(400).json({ error: 'No se ha subido ningún archivo' });
        
        // console.log(datos)
        
        const cotizacion         = await registroCotizaciones(datos);
        const id                 = cotizacion._id;
        const imagenesSubidas    = await subirS3(Archivos, id);
        // Generar un nombre único para el archivo o usar el proporcionado por el cliente
       
        res.json({

            mensaje : 'Productos e imagenes subidas correctamente',
            cotizacion,
            imagenes: imagenesSubidas,
            
        });
        
    } catch ( error ) {
      console.error('Error al subir el video:', error);
      res.status(500).json({ error: 'Error al subir el video' });
    }
};


const registroCotizaciones = async ( datos )=>{

console.log("ingreso 1")

const {
    serId        ,
    productosId  ,
    saboresId    ,
    porcionesId  ,
    fechaEvento  ,
    descripcion  ,
    precio       ,
    estado       ,} = datos;
    
    

    try{

        const produ     = await producto.findById(productosId)
        const sabor     = await Sabor.findById(saboresId)
        const porcion   = await porciones.findById(porcionesId)

        console.log(produ._id)
        console.log(sabor._id)
        console.log(porcion._id)
        

        const newcotizacion = await cotizacion.create({

               serId          :   serId, // pendiente por implementar
               productosId    :   produ._id,
               saboresId      :   sabor._id,
               porcionesId    :   porcion._id,
               fechaEvento    :   fechaEvento,
               descripcion    :   descripcion,
               estado         :   estado,
               precio         :   precio,
         });

        await newcotizacion.save();
        
        return newcotizacion


    }catch(err){

        console.log(err);
        res.status(500).send(err.message);

    };
};



const cotizacionUser = async (req, res) => {

    const usuarioId = req.params.userid;

  try {

    const userContizacion = await cotizacion.find({serId : usuarioId}); 
    if(userContizacion.length === 0) return res.status(400).json({ error: 'No se ha subido ningún archivo' });

    res.json(userContizacion);
    
  } catch (error) {

    console.log(err);
    res.status(500).send(err.message)
    
  }
}
const cotizacionAll = async (req, res) => {

   

  try {

    const allContizacion = await cotizacion.find(); 
    if(allContizacion.length === 0) return res.status(400).json({ error: 'No se ha subido ningún archivo' });

    res.json(allContizacion);
    
  } catch (error) {

    console.log(err);
    res.status(500).send(err.message)
    
  }
};
const cotizacionModificar = async (req, res) => {

    const id = req.params.idcotizacion;
    const {precio , estado} = req.body

   if (precio === undefined || estado === undefined) return res.status(400).json({error: "no hay valores precio y estado "})

  try {

    const modiContizacion = await cotizacion.findByIdAndUpdate(
        id,
        {
            precio : precio,
            estado : estado,
        },

        {new: true}
    ); 
    if(!modiContizacion) return res.status(400).json({ error: 'No se ha subido ningún archivo' });

    res.status(200).json(modiContizacion);
    
  } catch (error) {

    console.log(error);
    res.status(500).send(error.message)
    
  }
};




const subirS3 = async(Archivos, id, nombreProducto)=>{

    const imagenesSubidas = [];

    for( const file of Archivos ){

        const fileName  =   nombreProducto ? `${nombreProducto}.jpg` : file.originalname;
        const uniqueKey = `imagenes/${Date.now()}-${fileName}`;
        
        // Parámetros para la subida del archivo a S3
        const params = {

            Bucket     :  process.env.AWS_BUCKET_NAME, 
            Key        :  uniqueKey, // Nombre único del archivo en S3
            Body       :  file.buffer, // El contenido del archivo
            ContentType:  file.mimetype, // Tipo MIME del archivo
        };
    
        // Subir el archivo a S3 usando PutObjectCommand
        const command      = new PutObjectCommand( params );
        await s3Client.send( command );
      
        
        // Guardar la URL del IMAGEN en MongoDB
        const imagenNew = new imagenes({

            producto_id : id,
            url         : `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`,
            filename    : fileName, // Guardar el nombre renombrado
            usuario     : "pendinte de finir id del usuario",
            fechaSubida : new Date(),
        });
      
        await imagenNew.save();
        imagenesSubidas.push( imagenNew );
    };

    return imagenesSubidas

}

// ------------------registrar Productos-------------------------------------

const registroProductos = async ( datos )=>{
    
    const {nombreProducto,categoria,estadoProducto,descripcion} = datos;

    try{
        

        const newproducto = await producto.create({

            nombre_producto :  nombreProducto, 
            categoria       :  categoria, 
            estado_producto :  estadoProducto, 
            descripcion     :  descripcion, 

         });

        await newproducto.save();
        
        return newproducto


    }catch(err){

        console.log(err);
        res.status(500).send(err.message);

    };
}

//--------------------Registro de sabor--------------------------------

const registroSabores = async ( req , res)=>{

    const registroSabor = req.body;
    
    const {nombreSabor, categoriaSabor, descripcion, estado} = registroSabor;

    try{
        // const isUser = await User.findOne({email: email})
        // if(isUser){
        //     return res.json('Usuario ya Existe')
        // }

        const newsabor = await sabor.create({

            nombre_sabor    : nombreSabor, 
            categoria_sabor : categoriaSabor, 
            estado          : estado, 
            descripcion     : descripcion, 

         });

        await newsabor.save();
        
        res.json({ 

            mensaje : 'Se creo nuevo sabor',
            newsabor
        });


    }catch(err){

        console.log(err);
        res.status(500).send(err.message);

    };
}


const registroPorcioes = async ( req , res)=>{

    const registroporciones = req.body;
    
    const {diametro, porciones, estado} = registroporciones;

    try{
        // const isUser = await User.findOne({email: email})
        // if(isUser){
        //     return res.json('Usuario ya Existe')
        // }

        const newsporciones = await porcion.create({

            diametro    : diametro, 
            porciones   : porciones, 
            estado      : estado, 
         });

        await newsporciones.save();
        
        res.json({ 

            mensaje : 'Se creo nueva porcion',
            newsporciones
        });


    }catch(err){

        console.log(err);
        res.status(500).send(err.message);

    };
}




module.exports = {
    
    registroSabores,
    registroPorcioes,
    SubirImagenes,
    upload,
    subirCotizaciones,
    cotizacionUser,
    cotizacionAll,
    cotizacionModificar,
    

}
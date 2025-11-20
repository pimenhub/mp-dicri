const {sql, poolPromise} = require("../db.js");

//Registrar Indicio
async function addIndicio(req,res) {
   try{
        const {CodExpediente, DescripcionIndicio, ColorIndicio, TamanioIndicio, PesoIndicio, UbicacionIndicio, UsuarioRegistro, EstadoIndicio} = req.body;
        if(!CodExpediente || !DescripcionIndicio || !ColorIndicio || !TamanioIndicio || !PesoIndicio || !UbicacionIndicio || !UsuarioRegistro || !EstadoIndicio){
            return res.status(400).json({
                success:false, 
                message:"Faltan datos obligatorios"
            });
        }

        const pool = await poolPromise;
        const result = await pool.request()
        .input('CodExpediente', sql.Int, CodExpediente)
        .input('DescripcionIndicio', sql.VarChar(255), DescripcionIndicio)
        .input('ColorIndicio', sql.VarChar(50), ColorIndicio)
        .input('TamanioIndicio', sql.Decimal(5,2), TamanioIndicio)
        .input('PesoIndicio', sql.Decimal(5,2), PesoIndicio)
        .input('UbicacionIndicio', sql.VarChar(100), UbicacionIndicio)
        .input('UsuarioRegistro', sql.VarChar(50), UsuarioRegistro)
        .input('EstadoIndicio', sql.Int, EstadoIndicio)
        .execute("SP_ADD_INDICIO");
        res.status(200).json(result.output);
        console.log(result); 
   }
   catch(error){
        console.log("Error", error);
        res.status(500).json({
            success:false,
            message:"Error en el servidor",
            error:error.message
        });
   } 
}
module.exports = {
    addIndicio
};
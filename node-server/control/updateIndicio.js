const {sql, poolPromise} = require("../db.js");

//Actualizar Indicio
async function updateIndicio(req,res) {
   try{
        const {codIndicio} = req.params;
        const {DescripcionIndicio, ColorIndicio, TamanioIndicio, PesoIndicio, UbicacionIndicio} = req.body;
        if(!DescripcionIndicio || !ColorIndicio || !TamanioIndicio || !PesoIndicio || !UbicacionIndicio){
            return res.status(400).json({
                success:false, 
                message:"Faltan datos obligatorios"
            });
        }

        const pool = await poolPromise;
        const result = await pool.request()
        .input('CodIndicio', sql.Int, codIndicio)
        .input('DescripcionIndicio', sql.VarChar(255), DescripcionIndicio)
        .input('ColorIndicio', sql.VarChar(50), ColorIndicio)
        .input('TamanioIndicio', sql.Decimal(5,2), TamanioIndicio)
        .input('PesoIndicio', sql.Decimal(5,2), PesoIndicio)
        .input('UbicacionIndicio', sql.VarChar(100), UbicacionIndicio)
        .execute("SP_UPDATE_INDICIO");
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

//Anular Indicio
async function anularIndicio(req,res) {
   try{
        const {codIndicio} = req.params;
        const {EstadoIndicio} = req.body;
        if(!EstadoIndicio){
            return res.status(400).json({
                success:false, 
                message:"Faltan datos obligatorios"
            });
        }

        const pool = await poolPromise;
        const result = await pool.request()
        .input('CodIndicio', sql.Int, codIndicio)
        .input('EstadoIndicio', sql.Int, EstadoIndicio)
        .execute("SP_ANULAR_INDICIO");
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
    updateIndicio,
    anularIndicio
};
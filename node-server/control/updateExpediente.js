const {sql, poolPromise} = require("../db.js");

//Actualizar Traslado Expediente
async function updateTrasladoExpediente(req,res) {
   try{
        const {codExpediente} = req.params;
        const {EstadoExp, EtapaExp, JustificacionRechazo} = req.body;
        if(!EstadoExp || !EtapaExp){
            return res.status(400).json({
                success:false, 
                message:"Faltan datos obligatorios"
            });
        }

        const pool = await poolPromise;
        const result = await pool.request()
        .input('CodExpediente', sql.Int, codExpediente)
        .input('EstadoExp', sql.Int, EstadoExp)
        .input('EtapaExp', sql.Int, EtapaExp)
        .input('JustificacionRechazo', sql.VarChar(255), JustificacionRechazo)
        .execute("SP_TRASLADO_EXPEDIENTE");
        res.status(200).json(result.rowsAffected);
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
    updateTrasladoExpediente
};
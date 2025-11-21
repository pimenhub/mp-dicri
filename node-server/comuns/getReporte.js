const {sql, poolPromise} = require("../db.js");

//Reporte de Expedientes por Estado y Fecha de Registro
async function getExpedientesReporte(req,res) {
   try{
        const {estadoExpediente, fechaRegistro} = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
        .input('EstadoExpediente', sql.Int, estadoExpediente)
        .input('FechaRegistro', sql.Date, fechaRegistro)
        .execute("SP_REPORTE_EXPEDIENTES");
        console.log(result);

        if(result.recordset.length === 0){
            return res.status(404).json({
                success:false,
                message:"Expedientes no encontrados"
            });
        }
        res.status(200).json({
            success: true,
            dicriData:result.recordset
        });
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
    getExpedientesReporte
};
const {sql, poolPromise} = require("../db.js");

async function getIndiciosPorExpediente(req,res) {
   try{
        const {id} = req.params;
        if(isNaN(id)){
            return res.status(400).json({
                success:false,
                message:"El codigo debe ser un numero"
            });

        }
        const pool = await poolPromise;
        const result = await pool.request()
        .input('COD_EXPEDIENTE', sql.Int, id)
        .execute("SP_GET_INDICIOS_POR_EXP");
        console.log(result);

        if(result.recordset.length === 0){
            return res.status(404).json({
                success:false,
                message:"Expediente no encontrado"
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
    getIndiciosPorExpediente
};
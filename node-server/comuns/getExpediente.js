const {sql, poolPromise} = require("../db.js");

//Expedientes completos - Tecnico
async function getExpedientesTecnico(req,res){
   try{
        const pool = await poolPromise;
        const result = await pool.request().query("SP_GET_EXPEDIENTE_TECNICO");
        console.log(result);

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

//Expedientes por COD_EXPEDIENTE - tecnico
async function getExpedienteIDTecnico(req,res) {
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
        .execute("SP_GET_EXPEDIENTE_TECNICO_ID");
        console.log(result);

        if(result.recordset.length === 0){
            return res.status(404).json({
                success:false,
                message:"Expediente no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            dicriData:result.recordset[0]
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
//---------------------------------------------------------------

//Expedientes completos - Coordinador
async function getExpedientesCoordinador(req,res){
   try{
        const pool = await poolPromise;
        const result = await pool.request().query("SP_GET_EXPEDIENTE_COORDINADOR");
        console.log(result);

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

//Expedientes por COD_EXPEDIENTE
async function getExpedienteIDCoordinador(req,res) {
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
        .execute("SP_GET_EXPEDIENTE_COORDINADOR_ID");
        console.log(result);

        if(result.recordset.length === 0){
            return res.status(404).json({
                success:false,
                message:"Expediente no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            dicriData:result.recordset[0]
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
    getExpedientesTecnico,
    getExpedienteIDTecnico,
    getExpedientesCoordinador,
    getExpedienteIDCoordinador
};
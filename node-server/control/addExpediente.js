const {sql, poolPromise} = require("../db.js");

//Registrar Expediente
async function addExpediente(req,res) {
   try{
        const {UsuarioRegistro, EstadoExp, EtapaExp} = req.body;
        if(!UsuarioRegistro || !EstadoExp || !EtapaExp){
            return res.status(400).json({
                success:false, 
                message:"Faltan datos obligatorios"
            });
        }

        const pool = await poolPromise;
        const result = await pool.request()
        .input('UsuarioRegistro', sql.VarChar(50), UsuarioRegistro)
        .input('EstadoExp', sql.Int, EstadoExp)
        .input('EtapaExp', sql.Int, EtapaExp)
        .execute("SP_ADD_EXPEDIENTE");
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
    addExpediente
};
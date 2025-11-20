const sql = require("mssql")
require('dotenv').config();

//Configuracion para SQL Server
const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options:{
        encrypt:false, //esto si se usa azure
        enableArithAbort: true
    },
    port: parseInt(process.env.DB_PORT)
};

//Se crea el pool de conexion y se optiene como promesa
const poolPromise = new sql.ConnectionPool(config)
.connect()
.then(pool => {
    console.log("Conectado...!");
    return pool;
})
.catch(err => {
    console.error("Error de conexion: ",err)
    throw err;
});

//exportacion para sql y el pool de conexion
module.exports = {
    sql,
    poolPromise
};
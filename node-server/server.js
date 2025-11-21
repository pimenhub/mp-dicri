//Definicion de las constantes para el uso de Express
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {getExpedientesTecnico, getExpedienteIDTecnico, getExpedientesCoordinador, getExpedienteIDCoordinador} = require('./comuns/getExpediente.js');
const {getIndiciosPorExpediente} = require('./comuns/getIndicio.js');
const {addExpediente} = require('./control/addExpediente.js');
const {addIndicio} = require('./control/addIndicio.js');
const {updateTrasladoExpediente} = require('./control/updateExpediente.js');
const {updateIndicio, anularIndicio} = require('./control/updateIndicio.js');
const {getExpedientesReporte} = require('./comuns/getReporte.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`El servidor esta en el puerto ${PORT}`));

//----------Definicion de los GET a utilizar
//TBL_EXPEDIENTE - Tecnico
app.get("/api/dicri/expedientes", getExpedientesTecnico);
app.get("/api/dicri/expedientes/:id", getExpedienteIDTecnico);
//TBL_EXPEDIENTE - Coordinador
app.get("/api/dicri/coordinador", getExpedientesCoordinador);
app.get("/api/dicri/coordinador/:id", getExpedienteIDCoordinador);
//Indicios
app.get("/api/dicri/indicios/expediente/:id", getIndiciosPorExpediente);

//----------Definicion de los ADD a utilizar
app.post("/api/dicri/expedientes/add", addExpediente);
app.post("/api/dicri/indicios/add", addIndicio);

//----------Definicion de los UPDATE a utilizar
app.put("/api/dicri/expedientes/traslado/:codExpediente", updateTrasladoExpediente);
app.put("/api/dicri/indicios/update/:codIndicio", updateIndicio);
app.put("/api/dicri/indicios/anular/:codIndicio", anularIndicio);

//----------Definicion de los REPORTES a utilizar
app.get("/api/dicri/reporte/:estadoExpediente/:fechaRegistro", getExpedientesReporte);
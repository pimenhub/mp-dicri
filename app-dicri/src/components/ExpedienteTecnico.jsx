import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/minimal.css";

const Expediente = () => {
    // estado para todos los expedientes
    const [expedientes, setExpedientes] = useState([]);

    // modales y estados para indicios
    const [showAddIndiciosModal, setShowAddIndiciosModal] = useState(false);
    const [showViewIndiciosModal, setShowViewIndiciosModal] = useState(false);
    const [selectedExpedienteCode, setSelectedExpedienteCode] = useState(null);
    const [indiciosList, setIndiciosList] = useState([]);
    const [indicioForm, setIndicioForm] = useState({
        CodExpediente: "",
        DescripcionIndicio: "",
        ColorIndicio: "",
        TamanioIndicio: "",
        PesoIndicio: "",
        UbicacionIndicio: "",
        UsuarioRegistro: "", 
        EstadoIndicio: ""
    });

    const [savingIndicio, setSavingIndicio] = useState(false);

    useEffect(() => {
        fetchExpedientes();
    }, []);

    // funcion para obtener todos los expedientes
    const fetchExpedientes = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL_EXP);
            // Ajusta según la estructura real de respuesta
            setExpedientes(response.data.dicriData);
        } catch (error) {
            toast.error("Error al obtener los expedientes");
            console.error(error);
        }
    };

    //Crear nuevo expediente
    const crearNuevoExpediente = async () => {
        try {
            const payload = {
                UsuarioRegistro: "JPIMENTEL",
                EstadoExp: 1,
                EtapaExp: 1
            };
            const response = await axios.post(process.env.REACT_APP_API_URL_EXPEDIENTE_ADD, payload);
            console.log("crearNuevoExpediente response:", response?.data);
            toast.success("Expediente creado con éxito");
            fetchExpedientes();
        } catch (error) {
            toast.error("Error al crear el expediente", error);
            console.error(error);
        }
    };

    // abrir modal agregar indicios
    const openAddIndiciosModal = (codigo) => {
        setSelectedExpedienteCode(codigo);
        setIndicioForm({
            DescripcionIndicio: "",
            ColorIndicio: "",
            TamanioIndicio: "",
            PesoIndicio: "",
            UbicacionIndicio: ""
        });
        setShowAddIndiciosModal(true);
    };

    const closeAddIndiciosModal = () => {
        setShowAddIndiciosModal(false);
        setSelectedExpedienteCode(null);
    };

    // enviar indicio al backend
    const submitAddIndicio = async (e) => {
        e.preventDefault();
        if (!selectedExpedienteCode) {
            toast.error("Código de expediente no seleccionado");
            return;
        }
        try {
            setSavingIndicio(true);

            // Normalizar payload y parsear decimales
            const payload = {
                CodExpediente: selectedExpedienteCode,
                DescripcionIndicio: (indicioForm.DescripcionIndicio || "").trim(),
                ColorIndicio: indicioForm.ColorIndicio || null,
                TamanioIndicio: indicioForm.TamanioIndicio === "" ? null : parseFloat(indicioForm.TamanioIndicio),
                PesoIndicio: indicioForm.PesoIndicio === "" ? null : parseFloat(indicioForm.PesoIndicio),
                UbicacionIndicio: indicioForm.UbicacionIndicio || null,
                UsuarioRegistro: indicioForm.UsuarioRegistro || "JPIMENTEL",
                EstadoIndicio: indicioForm.EstadoIndicio || 1
            };

            console.log("submitAddIndicio payload:", payload);

            const response = await axios.post(process.env.REACT_APP_API_URL_INDICIOS_ADD, payload);
            console.log("submitAddIndicio response:", response?.data);

            toast.success("Indicio agregado");
            closeAddIndiciosModal();
            // opcional: refrescar lista de expedientes si el backend cambia conteos
            fetchExpedientes();
        } catch (error) {
            console.error("submitAddIndicio error:", error);
            toast.error("Error al agregar indicio: " + error);
        } finally {
            setSavingIndicio(false);
        }
    };

    // ver indicios de un expediente
    const openViewIndiciosModal = async (codigo) => {
        setSelectedExpedienteCode(codigo);
        setShowViewIndiciosModal(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL_INDICIOS_LIST}/${codigo}`);
            console.log(response);
            setIndiciosList(response.data.dicriData);
        } catch (error) {
            toast.error("Error al obtener indicios");
            console.error(error);
            setIndiciosList([]);
        }
    };

    const closeViewIndiciosModal = () => {
        setShowViewIndiciosModal(false);
        setSelectedExpedienteCode(null);
        setIndiciosList([]);
    };

    // traslado expediente - por el Tecnico
    const trasladarExpediente = async (codigoExpediente) => {
        try {
            const payload = {
                CodExpediente: codigoExpediente,
                EstadoExp: 2,
                EtapaExp: 2,
                JustificacionRechazo: null
            };
            const response = await axios.put(`${process.env.REACT_APP_API_URL_TRASLADO}/${codigoExpediente}`, payload);
            console.log("trasladarExpediente response:", response?.data);
            toast.success("Expediente trasladado");
            fetchExpedientes();
        } catch (error) {
            toast.error("Error al trasladar expediente", error);
            console.error(error);
        }
    };

    // anular expediente
    const anularExpediente = async (codigoExpediente) => {
        try {
            const payload = {
                CodExpediente: codigoExpediente,
                EstadoExp: 3,
                EtapaExp: 3,
                JustificacionRechazo: null
            };
            const response = await axios.put(`${process.env.REACT_APP_API_URL_TRASLADO}/${codigoExpediente}`, payload);
            console.log("anularExpediente response:", response?.data);
            toast.success("Expediente Anulado");
            fetchExpedientes();
        } catch (error) {
            toast.error("Error al anular el expediente", error);
            console.error(error);
        }
    };

    // anular indicio
    const anularIndicio = async (codigoIndicio) => {
        try {
            const payload = {
                CodIndicio: codigoIndicio,
                EstadoIndicio: 2
            };
            const response = await axios.put(`${process.env.REACT_APP_API_URL_ANULAR_INDICIO}/${codigoIndicio}`, payload);
            console.log("anularIndicio response:", response?.data);
            toast.success("Indicio Anulado");
            closeViewIndiciosModal();
            fetchExpedientes();
        } catch (error) {
            toast.error("Error al anular el indicio", error);
            console.error(error);
        }
    };
    // render componente ExpedienteTecnico
    return (
        <div className="container mt-5">
            <h1 className="mb-3">Expedientes - Etapa Técnica</h1>
            <button className="btn btn-outline-primary mb-3 btn-sm"
            onClick={() => crearNuevoExpediente()}>
                Crear Nuevo
            </button>

            <table className="table table-sm table-hover align-middle">
                <thead>
                <tr>
                    <th>Código</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Etapa</th>
                    <th className="text-muted-small">Justificación</th>
                    <th className="text-muted-small">Indicios</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {expedientes.map((exp) => (
                    <tr key={exp.COD_EXPEDIENTE}>
                        <td>{exp.COD_EXPEDIENTE}</td>
                        <td className="text-muted-small">{new Date(exp.FECHA_REGISTRO_EXPEDIENTE).toLocaleDateString("es-GT")}</td>
                        <td>{exp.NOMBRE_ESTADO_EXPEDIENTE}</td>
                        <td>{exp.NOMBRE_ETAPA_EXPEDIENTE}</td>
                        <td className="text-muted-small">{exp.JUSTIFICACION_RECHAZO_EXPEDIENTE}</td>
                        <td className="text-muted-small">{exp.CANTIDAD_INDICIO}</td>
                        <td>
                            <button
                                className="btn btn-outline-success btn-sm me-1"
                                onClick={() => openAddIndiciosModal(exp.COD_EXPEDIENTE)}
                                title="Agregar indicios"
                            >
                                Agregar
                            </button>

                            {Number(exp.CANTIDAD_INDICIO) > 0 ? (
                                <button
                                    className="btn btn-outline-info btn-sm me-1"
                                    onClick={() => openViewIndiciosModal(exp.COD_EXPEDIENTE)}
                                    title="Ver indicios"
                                >
                                    Ver
                                </button>
                            ) : null}

                            {Number(exp.CANTIDAD_INDICIO) > 0 ? (
                                <button
                                    className="btn btn-outline-warning btn-sm me-1"
                                    onClick={() => trasladarExpediente(exp.COD_EXPEDIENTE)}
                                    title="Traslado"
                                >
                                    Trasladar
                                </button>
                            ) : null}
                            
                            {Number(exp.CANTIDAD_INDICIO) === 0 ? (
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => anularExpediente(exp.COD_EXPEDIENTE)}
                                    title="Anular expediente"
                                >
                                    Anular
                                </button>
                            ) : null}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Modal Agregar Indicios */}
            {showAddIndiciosModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <form onSubmit={submitAddIndicio}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Agregar Indicio - {selectedExpedienteCode}</h5>
                                    <button type="button" className="btn-close" aria-label="Cerrar" onClick={closeAddIndiciosModal} />
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Descripción</label>
                                        <textarea
                                            className="form-control"
                                            value={indicioForm.DescripcionIndicio}
                                            onChange={(e) => setIndicioForm({ ...indicioForm, DescripcionIndicio: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <hr/>
                                    <div className="form-group">
                                        <label>Color</label>
                                        <select
                                            className="form-control"
                                            value={indicioForm.ColorIndicio}
                                            onChange={(e) => setIndicioForm({ ...indicioForm, ColorIndicio: e.target.value })}
                                            required
                                        >
                                            <option value="">-- Seleccionar color --</option>
                                            <option value="rojo">Rojo</option>
                                            <option value="azul">Azul</option>
                                            <option value="verde">Verde</option>
                                            <option value="amarillo">Amarillo</option>
                                            <option value="negro">Negro</option>
                                            <option value="blanco">Blanco</option>
                                            <option value="anaranjado">Anaranjado</option>
                                            <option value="morado">Morado</option>
                                            <option value="gris">Gris</option>
                                        </select>
                                    </div>
                                    <hr/>
                                    
                                        <div className="form-group">
                                            <label>Tamaño</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control"
                                                value={indicioForm.TamanioIndicio}
                                                onChange={(e) => setIndicioForm({ ...indicioForm, TamanioIndicio: e.target.value })}
                                                required
                                            />Centímetro
                                        </div>
                                        <hr/>
                                        <div className="form-group">
                                            <label>Peso</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control"
                                                value={indicioForm.PesoIndicio}
                                                onChange={(e) => setIndicioForm({ ...indicioForm, PesoIndicio: e.target.value })}
                                                required
                                            />Libras
                                        </div>
                                    <hr/>
                                    <div className="form-group">
                                        <label>Ubicación</label>
                                        <input
                                            className="form-control"
                                            value={indicioForm.UbicacionIndicio}
                                            onChange={(e) => setIndicioForm({ ...indicioForm, UbicacionIndicio: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={closeAddIndiciosModal}>Cerrar</button>
                                    <button type="submit" className="btn btn-outline-primary btn-sm" disabled={savingIndicio}>
                                        {savingIndicio ? "Guardando..." : "Guardar"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Ver Indicios */}
            {showViewIndiciosModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Indicios - {selectedExpedienteCode}</h5>
                                <button type="button" className="btn-close" aria-label="Cerrar" onClick={closeViewIndiciosModal} />
                            </div>
                            <div className="modal-body">
                                {indiciosList.length === 0 ? (
                                    <p>No hay indicios registrados.</p>
                                ) : (
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Código</th>
                                                <th>Descripción</th>
                                                <th>Color</th>
                                                <th>Tamaño (centímetro)</th>
                                                <th>Peso (libras)</th>
                                                <th>Ubicación</th>
                                                <th>Usuario Registro</th>
                                                <th>Anular Indicio</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {indiciosList.map((indicios) => (
                                                <tr key={indicios.COD_INDICIO}>
                                                    <td>{indicios.COD_INDICIO}</td>
                                                    <td>{indicios.DESCRIPCION_INDICIO}</td>
                                                    <td>{indicios.COLOR_INDICIO}</td>
                                                    <td>{indicios.TAMANIO_INDICIO}</td>
                                                    <td>{indicios.PESO_INDICIO}</td>
                                                    <td>{indicios.UBICACION_INDICIO}</td>  
                                                    <td>{indicios.USUARIO_REGISTRO}</td> 
                                                    <td>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => anularIndicio(indicios.COD_INDICIO)}
                                                            title="Anular indicio">
                                                            Anular
                                                        </button>
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-secondary btn-sm" onClick={closeViewIndiciosModal}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Expediente;
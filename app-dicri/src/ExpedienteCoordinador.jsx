import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/minimal.css";

const ExpedienteCoordinador = () => {
    const [expedientes, setExpedientes] = useState([]);

    const [showViewIndiciosModal, setShowViewIndiciosModal] = useState(false);
    const [selectedExpedienteCode, setSelectedExpedienteCode] = useState(null);
    const [indiciosList, setIndiciosList] = useState([]);

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectExpedienteCode, setRejectExpedienteCode] = useState(null);
    const [rejectJustificacion, setRejectJustificacion] = useState("");
    const [rejecting, setRejecting] = useState(false);

    useEffect(() => {
        fetchExpedientes();
    }, []);

    const fetchExpedientes = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL_EXP_COOR);
            // ajustar si tu backend devuelve otra estructura
            const raw = response?.data;
            const list = Array.isArray(raw) ? raw : (Array.isArray(raw?.dicriData) ? raw.dicriData : (raw?.data || []));
            setExpedientes(list);
        } catch (error) {
            console.error("fetchExpedientes error:", error);
            toast.error("Error al obtener los expedientes");
            setExpedientes([]);
        }
    };

    const openViewIndiciosModal = async (codigo) => {
        setSelectedExpedienteCode(codigo);
        setShowViewIndiciosModal(true);
        try {
            const url = `${process.env.REACT_APP_API_URL_INDICIOS_LIST}/${encodeURIComponent(codigo)}`;
            const response = await axios.get(url);
            const raw = response?.data;
            const list = Array.isArray(raw) ? raw : (Array.isArray(raw?.dicriData) ? raw.dicriData : (Array.isArray(raw?.indicios) ? raw.indicios : (raw?.data || [])));
            setIndiciosList(list);
            if (!list.length) toast.info("No hay indicios registrados para este expediente");
        } catch (error) {
            console.error("openViewIndiciosModal error:", error);
            toast.error("Error al obtener indicios");
            setIndiciosList([]);
        }
    };

    const closeViewIndiciosModal = () => {
        setShowViewIndiciosModal(false);
        setSelectedExpedienteCode(null);
        setIndiciosList([]);
    };

    const aprobarExpediente = async (codigoExpediente) => {
        if (!codigoExpediente) return toast.error("Código de expediente no proporcionado");
        try {
            const payload = {
                CodExpediente: codigoExpediente,
                EstadoExp: 3,
                EtapaExp: 3,
                JustificacionRechazo: null
            };
            const url = `${process.env.REACT_APP_API_URL_TRASLADO}/${encodeURIComponent(codigoExpediente)}`;
            const response = await axios.put(url, payload);
            console.log("aprobarExpediente response:", response?.data);
            toast.success("Expediente aprobado y finalizado");
            fetchExpedientes();
        } catch (error) {
            console.error("aprobarExpediente error:", error);
            const detail = error.response?.data?.message || error.response?.data || error.message || "Error desconocido";
            toast.error("Error al aprobar el expediente: " + (typeof detail === "string" ? detail : JSON.stringify(detail)));
        }
    };

    const rechazarExpediente = async (codigoExpediente, justificacion = null) => {
        if (!codigoExpediente) return toast.error("Código de expediente no proporcionado");
        try {
            const payload = {
                CodExpediente: codigoExpediente,
                EstadoExp: 4,
                EtapaExp: 1,
                JustificacionRechazo: justificacion
            };
            const url = `${process.env.REACT_APP_API_URL_TRASLADO}/${encodeURIComponent(codigoExpediente)}`;
            const response = await axios.put(url, payload);
            console.log("rechazarExpediente response:", response?.data);
            toast.success("Expediente rechazado");
            fetchExpedientes();
        } catch (error) {
            console.error("rechazarExpediente error:", error);
            const detail = error.response?.data?.message || error.response?.data || error.message || "Error desconocido";
            toast.error("Error al rechazar el expediente: " + (typeof detail === "string" ? detail : JSON.stringify(detail)));
        }
    };

    const openRejectModal = (codigo) => {
        setRejectExpedienteCode(codigo);
        setRejectJustificacion("");
        setShowRejectModal(true);
    };

    const closeRejectModal = () => {
        setShowRejectModal(false);
        setRejectExpedienteCode(null);
        setRejectJustificacion("");
    };

    const handleRejectSubmit = async (e) => {
        e.preventDefault();
        if (!rejectExpedienteCode) {
            toast.error("No hay expediente seleccionado para rechazar");
            return;
        }
        setRejecting(true);
        try {
            await rechazarExpediente(rejectExpedienteCode, rejectJustificacion.trim() || null);
            closeRejectModal();
        } catch (error) {
            console.error("handleRejectSubmit error:", error);
        } finally {
            setRejecting(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-3">Expedientes - Etapa Coordinación</h1>
            <button className="btn btn-outline-danger mb-3 btn-sm"
            // onClick={() => crearNuevoExpediente()}
            >
                Crear Reportes
            </button>
            <table className="table table-sm table-hover align-middle">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Etapa</th>
                        <th className="text-muted-small">Indicios</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {expedientes.map((exp) => (
                        <tr key={exp.COD_EXPEDIENTE || exp.id || JSON.stringify(exp)}>
                            <td>{exp.COD_EXPEDIENTE}</td>
                            <td className="text-muted-small">{exp.FECHA_REGISTRO_EXPEDIENTE}</td>
                            <td>{exp.NOMBRE_ESTADO_EXPEDIENTE}</td>
                            <td>{exp.NOMBRE_ETAPA_EXPEDIENTE}</td>
                            <td className="text-muted-small">{exp.CANTIDAD_INDICIO}</td>
                            <td>
                                {Number(exp.CANTIDAD_INDICIO) > 0 ? (
                                    <button
                                        className="btn btn-outline-info btn-sm me-1"
                                        onClick={() => openViewIndiciosModal(exp.COD_EXPEDIENTE)}
                                        title="Ver indicios"
                                    >
                                        Ver
                                    </button>
                                ) : null}

                                <button
                                    className="btn btn-outline-success btn-sm me-1"
                                    onClick={() => aprobarExpediente(exp.COD_EXPEDIENTE)}
                                    title="Aprobar expediente"
                                >
                                    Aprobar
                                </button>

                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => openRejectModal(exp.COD_EXPEDIENTE)}
                                    title="Rechazar expediente"
                                >
                                    Rechazar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
                                                <th>Tamaño</th>
                                                <th>Peso</th>
                                                <th>Ubicación</th>
                                                <th>Usuario</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {indiciosList.map((ind) => (
                                                <tr key={ind.COD_INDICIO || ind.id || JSON.stringify(ind)}>
                                                    <td>{ind.COD_INDICIO}</td>
                                                    <td>{ind.DESCRIPCION_INDICIO}</td>
                                                    <td>{ind.COLOR_INDICIO}</td>
                                                    <td>{ind.TAMANIO_INDICIO}</td>
                                                    <td>{ind.PESO_INDICIO}</td>
                                                    <td>{ind.UBICACION_INDICIO}</td>
                                                    <td>{ind.USUARIO_REGISTRO}</td>
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

            {showRejectModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <form onSubmit={handleRejectSubmit} className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Rechazar Expediente - {rejectExpedienteCode}</h5>
                                <button type="button" className="btn-close" aria-label="Cerrar" onClick={closeRejectModal} />
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Justificación del Rechazo</label>
                                    <textarea
                                        className="form-control"
                                        value={rejectJustificacion}
                                        onChange={(e) => setRejectJustificacion(e.target.value)}
                                        rows={4}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={closeRejectModal} disabled={rejecting}>Cerrar</button>
                                <button type="submit" className="btn btn-outline-danger btn-sm" disabled={rejecting}>
                                    {rejecting ? "Procesando..." : "Confirmar Rechazo"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default ExpedienteCoordinador;
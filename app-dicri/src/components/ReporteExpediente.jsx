import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/minimal.css";

const ReporteExpediente = ({ onClose }) => {
  const now = new Date();
  const [anio, setAnio] = useState(now.getFullYear());
  const [mes, setMes] = useState("");
  const [dia, setDia] = useState("");
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (anio && String(anio).length !== 4) {
      toast.error("Año inválido");
      return false;
    }
    if (mes && (Number(mes) < 1 || Number(mes) > 12)) {
      toast.error("Mes inválido");
      return false;
    }
    if (dia && (Number(dia) < 1 || Number(dia) > 31)) {
      toast.error("Día inválido");
      return false;
    }
    if ((mes && !anio) || (dia && (!mes || !anio))) {
      toast.error("Para filtrar por mes o día debe proporcionar también el año y el mes cuando corresponda");
      return false;
    }
    return true;
  };

  const pad = (v) => String(v).padStart(2, "0");

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const params = {};
      if (anio && mes && dia) {
        params.fecha = `${anio}-${pad(mes)}-${pad(dia)}`;
      } else {
        if (anio) params.anio = anio;
        if (mes) params.mes = mes;
        if (dia) params.dia = dia;
      }
      if (estado) params.estado = estado;

      // <-- NO TOCAR la forma de llamada que pediste -->
      const resp = await axios.get(`${process.env.REACT_APP_API_URL_REPORTES}/${params.estado}/${params.fecha}`, 
        {
          responseType: "blob",
          headers: { Accept: "application/pdf" },
        });

      const contentType = resp.headers["content-type"] || "";
      if (contentType.includes("pdf")) {
        // recibir PDF como blob y enviar a impresora sin abrir nueva pestaña
        const blob = new Blob([resp.data], { type: "application/pdf" });
        const blobUrl = window.URL.createObjectURL(blob);

        // crear iframe oculto y cargar pdf
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        iframe.src = blobUrl;

        document.body.appendChild(iframe);

        iframe.onload = () => {
          try {
            iframe.contentWindow.focus();
            // abrir diálogo de impresión
            iframe.contentWindow.print();
            toast.success("Impresión iniciada");
          } catch (err) {
            // fallback: forzar descarga si print falla
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = "reporte_expedientes.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.info("Se descargó el PDF (no fue posible iniciar impresión automáticamente).");
          } finally {
            // limpiar
            setTimeout(() => {
              window.URL.revokeObjectURL(blobUrl);
              iframe.remove();
            }, 1000);
          }
        };
      } else {
        // servidor devolvió JSON/text -> generar vista imprimible en iframe oculto y lanzar print (sin nueva pestaña)
        const text = await resp.data.text();
        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = text;
        }

        if (parsed && parsed.success && Array.isArray(parsed.dicriData)) {
          const rows = parsed.dicriData;
          const html = `<!doctype html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>DICRI</title>
              <style>
                /* cambiar a orientación vertical (portrait) */
                @page { size: letter portrait; margin: 20mm; }
                body { font-family: Arial, Helvetica, sans-serif; margin:0; padding:20px; }
                h1 { text-align:center; margin-bottom:12px; font-size:18px; }
                table { width:100%; border-collapse:collapse; font-size:12px; }
                th, td { border:1px solid #ccc; padding:6px 8px; text-align:left; }
                thead th { background:#f5f5f7; }
              </style>
            </head>
            <body>
              <h1>REPORTE EXPEDIENTES DICRI</h1>
              <table>
                <thead>
                  <tr>
                    <th>CÓDIGO</th>
                    <th>FECHA REGISTRO</th>
                    <th>ESTADO</th>
                    <th>ETAPA</th>
                    <th>USUARIO</th>
                    <th>INDICIOS</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows.map(r => `<tr>
                    <td>${r.COD_EXPEDIENTE ?? ""}</td>
                    <td>${r.FECHA_REGISTRO_EXPEDIENTE ? new Date(r.FECHA_REGISTRO_EXPEDIENTE).toLocaleDateString("es-GT", { timeZone: "UTC" }) : ""}</td>
                    <td>${r.ESTADO_EXPEDIENTE ?? r.NOMBRE_ESTADO_EXPEDIENTE ?? ""}</td>
                    <td>${r.ETAPA_EXPEDIENTE ?? r.NOMBRE_ETAPA_EXPEDIENTE ?? ""}</td>
                    <td>${r.USUARIO_REGISTRO_EXPEDIENTE ?? r.USUARIO_REGISTRO ?? ""}</td>
                    <td>${r.CANTIDAD_INDICIO ?? ""}</td>
                  </tr>`).join("")}
                </tbody>
              </table>
            </body>
            </html>`;

          // crear iframe oculto con srcdoc y disparar print
          const iframe = document.createElement("iframe");
          iframe.style.position = "fixed";
          iframe.style.right = "0";
          iframe.style.bottom = "0";
          iframe.style.width = "0";
          iframe.style.height = "0";
          iframe.style.border = "0";
          // usar srcdoc para insertar HTML
          iframe.srcdoc = html;

          document.body.appendChild(iframe);

          iframe.onload = () => {
            try {
              iframe.contentWindow.focus();
              iframe.contentWindow.print();
              toast.success("Impresión iniciada");
            } catch (err) {
              // fallback: crear blob HTML y descargar
              const blob = new Blob([html], { type: "text/html" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "reporte_expedientes.html";
              document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(url);
              toast.info("Se descargó el reporte HTML (no fue posible iniciar impresión automáticamente).");
            } finally {
              setTimeout(() => iframe.remove(), 500);
            }
          };
        } else {
          const msg = parsed?.message || parsed?.error || parsed || "Respuesta inesperada del servidor";
          const msgStr = typeof msg === "string" ? msg : JSON.stringify(msg);
          toast.error("Error al generar PDF: " + msgStr);
        }
      }
    } catch (err) {
      console.error("reporte error:", err);
      const detailRaw = err.response?.data || err.response?.data?.message || err.message || "Error al generar el reporte";
      const detail = typeof detailRaw === "string" ? detailRaw : JSON.stringify(detailRaw);
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">REPORTE EXPEDIENTES DICRI</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="row g-2 mb-3">
                <div className="col-auto">
                  <label className="form-label">Año</label>
                  <input className="form-control" type="number" value={anio} onChange={(e) => setAnio(e.target.value)} required />
                </div>
                <div className="col-auto">
                  <label className="form-label">Mes</label>
                  <input className="form-control" type="number" min="1" max="12" value={mes} onChange={(e) => setMes(e.target.value)} required />
                </div>
                <div className="col-auto">
                  <label className="form-label">Día</label>
                  <input className="form-control" type="number" min="1" max="31" value={dia} onChange={(e) => setDia(e.target.value)} required />
                </div>
                <div className="col-auto">
                  <label className="form-label">Estado</label>
                  <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)} required>
                    <option value="">-- Todos --</option>
                    <option value="1">1 - Registrado</option>
                    <option value="2">2 - En revisión</option>
                    <option value="3">3 - Aprobado</option>
                    <option value="4">4 - Rechazado</option>
                    <option value="5">5 - Cerrado</option>
                  </select>
                </div>

                <div className="col-auto d-flex align-items-end">
                  <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                    {loading ? "Generando..." : "Generar PDF"}
                  </button>
                </div>
              </div>

              <p className="text-muted">Complete todos los campos que le son requeridos en el filtro.</p>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose}>Cerrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReporteExpediente;
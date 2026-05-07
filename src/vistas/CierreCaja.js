import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../estilos/CierreCaja.css';

function CierreCaja({ usuario, onClose, onLogout }) {
    const [reporte, setReporte] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    useEffect(() => {
        cargarCierre();
    }, []);

    const cargarCierre = async () => {
        try {
            const data = await api.getCierreCaja(usuario.id);
            setReporte(data);
        } catch (error) {
            console.error('Error al cargar cierre:', error);
        } finally {
            setLoading(false);
        }
    };

    const cerrarYSalir = () => {
        setMostrarConfirmacion(false);
        api.logout();
        onLogout();
    };

    if (loading) {
        return <div className="cierre-container"><p>Cargando...</p></div>;
    }

    return (
        <div className="cierre-container">
            <div className="cierre-header">
                <h2>Cierre de Caja</h2>
                <button className="btn-cerrar" onClick={onClose}>Cerrar</button>
            </div>

            <div className="cierre-content">
                <div className="cierre-resumen">
                    <h3>Resumen del Turno</h3>
                    <div className="resumen-item">
                        <span>Cajero:</span>
                        <strong>{usuario.nombre}</strong>
                    </div>
                    <div className="resumen-item">
                        <span>Fecha:</span>
                        <strong>{new Date().toLocaleDateString()}</strong>
                    </div>
                    <div className="resumen-item">
                        <span>Hora Inicio:</span>
                        <strong>{reporte?.hora_inicio ? new Date(reporte.hora_inicio).toLocaleTimeString() : '-'}</strong>
                    </div>
                    <div className="resumen-item">
                        <span>Hora Cierre:</span>
                        <strong>{reporte?.hora_fin ? new Date(reporte.hora_fin).toLocaleTimeString() : '-'}</strong>
                    </div>
                    <div className="resumen-item highlight">
                        <span>Total Pedidos:</span>
                        <strong>{Number(reporte?.total_pedidos || 0)}</strong>
                    </div>
                    <div className="resumen-item total">
                        <span>TOTAL VENTAS:</span>
                        <strong>Bs. {Number(reporte?.total_ventas || 0).toFixed(2)}</strong>
                    </div>
                </div>

                <div className="cierre-productos">
                    <h3>Productos Vendidos</h3>
                    {reporte?.productos?.length === 0 ? (
                        <p>No hay ventas registradas</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reporte?.productos?.map((p, idx) => (
                                    <tr key={idx}>
                                        <td>{p.nombre}</td>
                                        <td>{p.categoria}</td>
                                        <td>{Number(p.cantidad)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="cierre-acciones">
                    <button className="btn-cerrar-caja" onClick={() => setMostrarConfirmacion(true)}>Cerrar Caja</button>
                </div>
            </div>

            {mostrarConfirmacion && (
                <div className="modal-cierre">
                    <div className="modal-cierre-content">
                        <h3>Confirmar Cierre</h3>
                        <p>¿Seguro que quieres cerrar caja?</p>
                        <p className="modal-info">Se guardará el reporte y se cerrará tu sesión.</p>
                        <div className="modal-cierre-botones">
                            <button className="btn-confirmar" onClick={cerrarYSalir}>Sí, cerrar caja</button>
                            <button className="btn-cancelar" onClick={() => setMostrarConfirmacion(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CierreCaja;


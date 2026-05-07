import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../estilos/Facturas.css';

function Facturas({ onClose }) {
    const [facturas, setFacturas] = useState([]);
    const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarFacturas();
    }, []);

    const cargarFacturas = async () => {
        try {
            const data = await api.getFacturas();
            setFacturas(data);
        } catch (error) {
            console.error('Error al cargar facturas:', error);
        } finally {
            setLoading(false);
        }
    };

    const verFactura = async (id) => {
        try {
            const data = await api.getFacturaById(id);
            setFacturaSeleccionada(data);
        } catch (error) {
            console.error('Error al cargar factura:', error);
        }
    };

    const cerrarFactura = () => {
        setFacturaSeleccionada(null);
    };

    const imprimirFactura = () => {
        window.print();
    };

    if (loading) {
        return <div className="facturas-container"><p>Cargando...</p></div>;
    }

    return (
        <div className="facturas-container">
            <div className="facturas-header">
                <h2>Facturas Guardadas</h2>
                <button className="btn-cerrar" onClick={onClose}>Cerrar</button>
            </div>

            {facturaSeleccionada ? (
                <div className="modal-factura">
                    <div className="factura">
                        <h2>Doña Choca</h2>
                        <p className="factura-fecha">{new Date(facturaSeleccionada.fecha).toLocaleString()}</p>
                        <p className="factura-pedido">Factura #{facturaSeleccionada.id}</p>
                        <p className="factura-cajero">Cajero: {facturaSeleccionada.nombre_usuario}</p>
                        <hr />
                        <div className="factura-items">
                            {facturaSeleccionada.datos.productos.map((p, i) => (
                                <div key={i} className="factura-item">
                                    <span>{p.cantidad}x {p.nombre}</span>
                                    <span>Bs. {(p.precio * p.cantidad).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <hr />
                        <div className="factura-total">
                            <strong>TOTAL:</strong>
                            <strong>Bs. {Number(facturaSeleccionada.total).toFixed(2)}</strong>
                        </div>
                        <div className="factura-botones">
                            <button className="btn-imprimir-factura" onClick={imprimirFactura}>Imprimir</button>
                            <button className="btn-cerrar" onClick={cerrarFactura}>Cerrar</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="facturas-lista">
                    {facturas.length === 0 ? (
                        <p className="sin-facturas">No hay facturas guardadas</p>
                    ) : (
                        facturas.map(factura => (
                            <div key={factura.id} className="factura-card" onClick={() => verFactura(factura.id)}>
                                <div className="factura-card-header">
                                    <span className="factura-id">Factura #{factura.id}</span>
                                    <span className="factura-fecha">{new Date(factura.fecha).toLocaleString()}</span>
                                </div>
                                <div className="factura-card-body">
                                    <span>Cajero: {factura.nombre_usuario}</span>
                                    <span className="factura-monto">Bs. {Number(factura.total).toFixed(2)}</span>
                                </div>
                                <div className="factura-card-items">
                                    {factura.datos.productos.slice(0, 2).map((p, i) => (
                                        <span key={i}>{p.cantidad}x {p.nombre}</span>
                                    ))}
                                    {factura.datos.productos.length > 2 && <span>...y {factura.datos.productos.length - 2} más</span>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Facturas;
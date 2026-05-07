import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../estilos/Admin.css';

function Admin() {
    const hoy = new Date().toISOString().split('T')[0];
    const [reporteCaja, setReporteCaja] = useState(null);
    const [reportePlatos, setReportePlatos] = useState([]);
    const [reporteCajeros, setReporteCajeros] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [facturas, setFacturas] = useState([]);
    const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tabActiva, setTabActiva] = useState('reportes');
    
    const [fechaOrdenInicio, setFechaOrdenInicio] = useState(hoy);
    const [fechaOrdenFin, setFechaOrdenFin] = useState(hoy);
    const [fechaFactInicio, setFechaFactInicio] = useState(hoy);
    const [fechaFactFin, setFechaFactFin] = useState(hoy);
    const [fechaReporte, setFechaReporte] = useState(hoy);
    
    const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);
    const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', password: '', rol: 'cajero' });
    const [editarPassword, setEditarPassword] = useState(null);
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

    useEffect(() => {
        cargarDatos();
    }, [tabActiva]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            if (tabActiva === 'usuarios') {
                const data = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/usuarios`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                }).then(r => r.json());
                setUsuarios(data);
            } else if (tabActiva === 'ordenes') {
                const data = await api.getPedidos(fechaOrdenInicio, fechaOrdenFin);
                setPedidos(data);
            } else if (tabActiva === 'facturas') {
                const data = await api.getFacturas(fechaFactInicio, fechaFactFin);
                setFacturas(data);
            } else {
                const [caja, platos, cajeros] = await Promise.all([
                    api.getReporteCaja(fechaReporte),
                    api.getReportePlatos(fechaReporte),
                    api.getReporteCajeros(fechaReporte)
                ]);
                setReporteCaja(caja);
                setReportePlatos(platos);
                setReporteCajeros(cajeros);
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const aplicarFiltroOrdenes = () => {
        cargarDatos();
    };

    const aplicarFiltroFacturas = () => {
        cargarDatos();
    };

    const aplicarFiltroReportes = () => {
        cargarDatos();
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

    const crearUsuario = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/usuarios`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(nuevoUsuario)
            });
            alert('Usuario creado exitosamente');
            setMostrarModalUsuario(false);
            setNuevoUsuario({ nombre: '', password: '', rol: 'cajero' });
            cargarDatos();
        } catch (error) {
            alert('Error al crear usuario');
        }
    };

    const eliminarUsuario = async () => {
        try {
            await api.deleteUsuario(usuarioAEliminar);
            setUsuarioAEliminar(null);
            cargarDatos();
        } catch (error) {
            alert('Error al eliminar usuario');
        }
    };

    const cambiarPassword = async (e) => {
        e.preventDefault();
        try {
            await api.updatePasswordUsuario(editarPassword, nuevaPassword);
            alert('Password actualizado');
            setEditarPassword(null);
            setNuevaPassword('');
        } catch (error) {
            alert('Error al actualizar password');
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div className="admin-logo">⚙️</div>
                <div className="admin-title">
                    <h2>Panel de Administrador</h2>
                    <p>Gestión completa del sistema</p>
                </div>
            </div>
            
            <div className="admin-tabs">
                <button 
                    className={`tab-btn ${tabActiva === 'reportes' ? 'active' : ''}`}
                    onClick={() => setTabActiva('reportes')}
                >
                    <span className="tab-icon">📊</span>
                    <span className="tab-text">Reportes</span>
                </button>
                <button 
                    className={`tab-btn ${tabActiva === 'ordenes' ? 'active' : ''}`}
                    onClick={() => setTabActiva('ordenes')}
                >
                    <span className="tab-icon">📋</span>
                    <span className="tab-text">Órdenes</span>
                </button>
                <button 
                    className={`tab-btn ${tabActiva === 'facturas' ? 'active' : ''}`}
                    onClick={() => setTabActiva('facturas')}
                >
                    <span className="tab-icon">🧾</span>
                    <span className="tab-text">Facturas</span>
                </button>
                <button 
                    className={`tab-btn ${tabActiva === 'usuarios' ? 'active' : ''}`}
                    onClick={() => setTabActiva('usuarios')}
                >
                    <span className="tab-icon">👥</span>
                    <span className="tab-text">Usuarios</span>
                </button>
            </div>

            {tabActiva === 'usuarios' ? (
                <div className="usuarios-panel">
                    <div className="usuarios-header">
                        <h3>Usuarios del Sistema</h3>
                        <button className="btn-nuevo" onClick={() => setMostrarModalUsuario(true)}>
                            + Nuevo Usuario
                        </button>
                    </div>
                    
                    <table className="tabla-usuarios">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.nombre}</td>
                                    <td><span className={`badge ${u.rol}`}>{u.rol}</span></td>
                                    <td>
                                        <button 
                                            className="btn-accion"
                                            onClick={() => setEditarPassword(u.id)}
                                        >Password</button>
                                        <button 
                                            className="btn-accion eliminar"
                                            onClick={() => setUsuarioAEliminar(u.id)}
                                        >Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : tabActiva === 'ordenes' ? (
                <div className="ordenes-panel">
                    <div className="panel-header">
                        <h3>Todas las Órdenes</h3>
                        <div className="filtro-fechas">
                            <input type="date" value={fechaOrdenInicio} onChange={e => setFechaOrdenInicio(e.target.value)} />
                            <span>hasta</span>
                            <input type="date" value={fechaOrdenFin} onChange={e => setFechaOrdenFin(e.target.value)} />
                            <button className="btn-filtrar" onClick={aplicarFiltroOrdenes}>Filtrar</button>
                        </div>
                    </div>
                    {loading ? (
                        <p>Cargando órdenes...</p>
                    ) : pedidos.length === 0 ? (
                        <p className="sin-ordenes">No hay órdenes registradas</p>
                    ) : (
                        <table className="tabla-ordenes">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Cajero</th>
                                    <th>Productos</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map(pedido => (
                                    <tr key={pedido.id}>
                                        <td>#{pedido.id}</td>
                                        <td>{new Date(pedido.fecha).toLocaleString()}</td>
                                        <td>{pedido.nombre_usuario || 'N/A'}</td>
                                        <td>
                                            <div className="productos-lista">
                                                {pedido.detalles?.map((d, i) => (
                                                    <span key={i}>{d.cantidad}x {d.producto}</span>
                                                )) || 'Sin detalles'}
                                            </div>
                                        </td>
                                        <td>Bs. {Number(pedido.total).toFixed(2)}</td>
                                        <td>
                                            <span className={`badge-estado ${
                                                pedido.estado === 'entregado' ? 'badge-entregado' :
                                                pedido.estado === 'listo' ? 'badge-listo' :
                                                'badge-pendiente'
                                            }`}>
                                                {pedido.estado === 'en preparación' ? 'En Proceso' :
                                                 pedido.estado === 'listo' ? 'Listo' :
                                                 pedido.estado === 'entregado' ? 'Entregado' :
                                                 pedido.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : tabActiva === 'facturas' ? (
                <div className="facturas-panel">
                    <div className="panel-header">
                        <h3>Historial de Facturas</h3>
                        <div className="filtro-fechas">
                            <input type="date" value={fechaFactInicio} onChange={e => setFechaFactInicio(e.target.value)} />
                            <span>hasta</span>
                            <input type="date" value={fechaFactFin} onChange={e => setFechaFactFin(e.target.value)} />
                            <button className="btn-filtrar" onClick={aplicarFiltroFacturas}>Filtrar</button>
                        </div>
                    </div>
                    {loading ? (
                        <p>Cargando facturas...</p>
                    ) : facturas.length === 0 ? (
                        <p className="sin-facturas">No hay facturas registradas</p>
                    ) : (
                        <table className="tabla-facturas">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Cajero</th>
                                    <th>Total</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facturas.map(factura => (
                                    <tr key={factura.id}>
                                        <td>#{factura.id}</td>
                                        <td>{new Date(factura.fecha).toLocaleString()}</td>
                                        <td>{factura.nombre_usuario || 'N/A'}</td>
                                        <td>Bs. {Number(factura.total).toFixed(2)}</td>
                                        <td>
                                            <button
                                                className="btn-accion"
                                                onClick={() => verFactura(factura.id)}
                                            >Ver</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <div className="reportes-panel">
                    <div className="panel-header">
                        <h3>Reportes</h3>
                        <div className="filtro-fechas">
                            <label>Fecha:</label>
                            <input type="date" value={fechaReporte} onChange={e => setFechaReporte(e.target.value)} />
                            <button className="btn-filtrar" onClick={aplicarFiltroReportes}>Filtrar</button>
                        </div>
                    </div>
                    <div className="reportes-grid">
                        <div className="reporte-card">
                            <h3>📦 Resumen del Día</h3>
                            <div className="reporte-caja">
                                <div className="caja-item">
                                    <span>Total Pedidos:</span>
                                    <strong>{Number(reporteCaja?.total_pedidos || 0)}</strong>
                                </div>
                                <div className="caja-item highlight">
                                    <span>Ventas del Día:</span>
                                    <strong>Bs. {Number(reporteCaja?.total_ventas || 0).toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="reporte-card">
                            <h3>🍔 Productos Más Vendidos</h3>
                            {reportePlatos.length === 0 ? (
                                <p>Sin ventas hoy</p>
                            ) : (
                                <table>
                                    <thead><tr><th>Producto</th><th>Cantidad</th><th>Total</th></tr></thead>
                                    <tbody>
                                        {reportePlatos.map((p, i) => (
                                            <tr key={i}>
                                                <td>{p.nombre}</td>
                                                <td>{Number(p.cantidad_vendida)}</td>
                                                <td>Bs. {Number(p.total_vendido).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="reporte-card">
                            <h3>👤 Rendimiento por Cajero</h3>
                            {reporteCajeros.length === 0 ? (
                                <p>Sin datos</p>
                            ) : (
                                <table>
                                    <thead><tr><th>Cajero</th><th>Pedidos</th><th>Total</th></tr></thead>
                                    <tbody>
                                        {reporteCajeros.map((c, i) => (
                                            <tr key={i}>
                                                <td>{c.nombre}</td>
                                                <td>{Number(c.total_pedidos)}</td>
                                                <td>Bs. {Number(c.total_ventas || 0).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {mostrarModalUsuario && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Nuevo Usuario</h3>
                        <form onSubmit={crearUsuario}>
                            <input 
                                type="text" 
                                placeholder="Nombre de usuario" 
                                value={nuevoUsuario.nombre}
                                onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})}
                                required
                            />
                            <input 
                                type="password" 
                                placeholder="Contraseña" 
                                value={nuevoUsuario.password}
                                onChange={(e) => setNuevoUsuario({...nuevoUsuario, password: e.target.value})}
                                required
                            />
                            <select 
                                value={nuevoUsuario.rol}
                                onChange={(e) => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})}
                            >
                                <option value="cajero">Cajero</option>
                                <option value="cocina">Cocina</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="modal-botones">
                                <button type="submit">Crear</button>
                                <button type="button" onClick={() => setMostrarModalUsuario(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editarPassword && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Cambiar Password</h3>
                        <form onSubmit={cambiarPassword}>
                            <input 
                                type="password" 
                                placeholder="Nueva contraseña" 
                                value={nuevaPassword}
                                onChange={(e) => setNuevaPassword(e.target.value)}
                                required
                            />
                            <div className="modal-botones">
                                <button type="submit">Actualizar</button>
                                <button type="button" onClick={() => setEditarPassword(null)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {usuarioAEliminar && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirmar Eliminación</h3>
                        <p>¿Está seguro de eliminar este usuario?</p>
                        <div className="modal-botones">
                            <button onClick={eliminarUsuario}>Eliminar</button>
                            <button onClick={() => setUsuarioAEliminar(null)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {facturaSeleccionada && (
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
            )}
        </div>
    );
}

export default Admin;
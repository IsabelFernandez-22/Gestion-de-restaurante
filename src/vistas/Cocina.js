import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../estilos/Cocina.css';

function Cocina({ usuario }) {
    const [pedidos, setPedidos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showStock, setShowStock] = useState(false);
    const esCajero = usuario?.rol === 'cajero';
    const esCocina = usuario?.rol === 'cocina';
    const esAdmin = usuario?.rol === 'admin';

    const cargarPedidos = async () => {
        try {
            const data = await api.getPedidos();
            setPedidos(data);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
        }
    };

    const cargarProductos = async () => {
        try {
            const data = await api.getProductos();
            const productosNumericos = data.map(p => ({
                ...p,
                precio: Number(p.precio),
                disponible: p.disponible === 1 || p.disponible === true
            }));
            setProductos(productosNumericos);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    };

    useEffect(() => {
        cargarPedidos();
        cargarProductos();
        const intervalo = setInterval(() => {
            cargarPedidos();
            cargarProductos();
        }, 5000);
        return () => clearInterval(intervalo);
    }, []);

    const cambiarEstado = async (id, estado) => {
        setLoading(true);
        try {
            await api.updateEstadoPedido(id, estado);
            cargarPedidos();
        } catch (error) {
            console.error('Error al actualizar pedido:', error);
            alert('Error al actualizar el pedido');
        } finally {
            setLoading(false);
        }
    };

    const eliminarPedido = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar este pedido?')) return;
        try {
            await api.deletePedido(id);
            cargarPedidos();
        } catch (error) {
            console.error('Error al eliminar pedido:', error);
            alert('Error al eliminar el pedido');
        }
    };

    const toggleDisponibilidad = async (producto) => {
        const nuevaDisponibilidad = !producto.disponible;
        const mensaje = nuevaDisponibilidad 
            ? `${producto.nombre} está disponible` 
            : `Se agotó: ${producto.nombre}`;
        
        try {
            await api.updateDisponibilidad(producto.id, nuevaDisponibilidad, mensaje);
            cargarProductos();
            alert(nuevaDisponibilidad 
                ? `${producto.nombre} ahora está disponible` 
                : `${producto.nombre} marcado como AGOTADO`);
        } catch (error) {
            console.error('Error al actualizar disponibilidad:', error);
        }
    };

    const getEstadoBadge = (estado) => {
        switch (estado) {
            case 'en preparación': return 'badge-pendiente';
            case 'listo': return 'badge-listo';
            case 'entregado': return 'badge-entregado';
            default: return 'badge-ninguno';
        }
    };

    const getEstadoTexto = (estado) => {
        switch (estado) {
            case 'en preparación': return 'En Proceso';
            case 'listo': return 'Listo para Servir';
            default: return 'Pendiente';
        }
    };

    const pedidosFiltrados = esCajero 
        ? pedidos.filter(p => p.estado !== 'entregado' && p.estado !== 'listo')
        : pedidos.filter(p => p.estado === 'en preparación' || p.estado === 'listo');

    return (
        <div className="cocina-container">
            <div className="cocina-header">
                <h2>{esCajero ? 'Estado de Pedidos' : esAdmin ? 'Cocina - Admin' : 'Cocina - Pedidos'}</h2>
                {(esCocina || esAdmin) && (
                    <button className="btn-stock" onClick={() => setShowStock(!showStock)}>
                        {showStock ? 'Ver Pedidos' : 'Control de Stock'}
                    </button>
                )}
            </div>

            {showStock ? (
                <div className="stock-container">
                    <h3>Control de Stock</h3>
                    <p className="stock-info">📦 Click en el producto para marcar como disponible/agotado</p>
                    {Object.entries(
                        productos.reduce((acc, producto) => {
                            const cat = producto.categoria || 'Sin categoría';
                            if (!acc[cat]) acc[cat] = [];
                            acc[cat].push(producto);
                            return acc;
                        }, {})
                    ).map(([categoria, productosCat]) => (
                        <div key={categoria} className="stock-categoria">
                            <h4 className="stock-categoria-titulo">{categoria}</h4>
                            <div className="stock-grid">
                                {productosCat.map(producto => (
                                    <div 
                                        key={producto.id} 
                                        className={`stock-card ${producto.disponible ? 'disponible' : 'agotado'}`}
                                        onClick={() => esCocina && toggleDisponibilidad(producto)}
                                        title={esCocina ? `Click para cambiar estado` : 'Solo cocina puede modificar'}
                                    >
                                        <span className="stock-nombre">{producto.nombre}</span>
                                        <span className="stock-badge">
                                            {producto.disponible ? '✓ Disponible' : '✗ Agotado'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {pedidosFiltrados.length === 0 ? (
                        <p className="sin-pedidos">{esCajero ? 'No hay pedidos activos' : 'No hay pedidos pendientes'}</p>
                    ) : (
                        <div className="pedidos-grid">
                            {pedidosFiltrados.map(pedido => (
                                <div key={pedido.id} className="pedido-card">
                                    <div className="pedido-header">
                                        <span className="pedido-id">Pedido #{pedido.id}</span>
                                        <span className={`badge-estado ${getEstadoBadge(pedido.estado)}`}>
                                            {getEstadoTexto(pedido.estado)}
                                        </span>
                                    </div>
                                    <div className="pedido-hora">
                                        {new Date(pedido.fecha).toLocaleString()}
                                    </div>
                                    <div className="pedido-detalles">
                                        {pedido.detalles ? pedido.detalles.map((detalle, idx) => (
                                            <div key={idx} className="detalle-item">
                                                <span className="detalle-cantidad">{detalle.cantidad}x</span>
                                                <span className="detalle-nombre">{detalle.producto}</span>
                                            </div>
                                        )) : (
                                            <div className="detalle-item">
                                                <span className="detalle-nombre">Cargando detalles...</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="pedido-footer">
                                        <span className="pedido-total">Total: Bs. {Number(pedido.total).toFixed(2)}</span>
                                    </div>
                                    {(esCocina || esAdmin) && (
                                        <div className="botones-estado">
                                            <button 
                                                className={`btn-estado ${pedido.estado === 'en preparación' ? 'active' : ''}`}
                                                onClick={() => cambiarEstado(pedido.id, 'en preparación')}
                                                disabled={loading}
                                            >
                                                En Proceso
                                            </button>
                                            <button 
                                                className={`btn-estado btn-listo ${pedido.estado === 'listo' ? 'active' : ''}`}
                                                onClick={() => cambiarEstado(pedido.id, 'listo')}
                                                disabled={loading}
                                            >
                                                Listo para Servir
                                            </button>
                                            <button 
                                                className="btn-eliminar-pedido"
                                                onClick={() => eliminarPedido(pedido.id)}
                                                disabled={loading}
                                            >
                                                ✕ Eliminar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Cocina;
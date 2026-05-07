import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Facturas from './Facturas';
import CierreCaja from './CierreCaja';
import '../estilos/Caja.css';

function Caja({ usuario, onLogout }) {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [categoria, setCategoria] = useState('todos');
    const [loading, setLoading] = useState(false);
    const [pedidos, setPedidos] = useState([]);
    const [mostrarFactura, setMostrarFactura] = useState(null);
    const [mostrarFacturas, setMostrarFacturas] = useState(false);
    const [mostrarCierre, setMostrarCierre] = useState(false);
    const [notificaciones, setNotificaciones] = useState([]);

    useEffect(() => {
        cargarProductos();
        cargarPedidos();
        cargarNotificaciones();
        const intervalo = setInterval(() => {
            cargarPedidos();
            cargarProductos();
            cargarNotificaciones();
        }, 3000);
        return () => clearInterval(intervalo);
    }, []);

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

    const cargarPedidos = async () => {
        try {
            const data = await api.getPedidos();
            setPedidos(data.filter(p => p.estado !== 'entregado'));
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
        }
    };

    const cargarNotificaciones = async () => {
        try {
            const data = await api.getNotificaciones();
            setNotificaciones(data);
        } catch (error) {
            console.error('Error al cargar notificaciones:', error);
        }
    };

    const marcarNotificacionLeida = async (id) => {
        try {
            await api.markNotificacionLeida(id);
            setNotificaciones(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error('Error al marcar notificación:', error);
        }
    };

    const productosFiltrados = productos.filter(p => {
        const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = categoria === 'todos' || p.categoria === categoria;
        const disponible = p.disponible !== false;
        return coincideBusqueda && coincideCategoria && disponible;
    });

    const agregarAlCarrito = (producto) => {
        if (producto.disponible === false) {
            alert('Este producto está agotado');
            return;
        }
        setCarrito(prev => {
            const existente = prev.find(p => p.id === producto.id);
            if (existente) {
                return prev.map(p =>
                    p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
                );
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });
    };

    const cambiarCantidad = (id, delta) => {
        setCarrito(prev => prev.map(p => {
            if (p.id === id) {
                const nuevaCantidad = p.cantidad + delta;
                return nuevaCantidad > 0 ? { ...p, cantidad: nuevaCantidad } : p;
            }
            return p;
        }).filter(p => p.cantidad > 0));
    };

    const eliminarDelCarrito = (id) => {
        setCarrito(prev => prev.filter(p => p.id !== id));
    };

    const total = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

    const confirmarPedido = async () => {
        if (carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        if (!usuario?.id) {
            alert('No hay usuario logueado');
            return;
        }

        setLoading(true);
        try {
            const productosParaBackend = carrito.map(p => ({
                id_producto: p.id,
                cantidad: p.cantidad
            }));
            const resultado = await api.createPedido(usuario.id, productosParaBackend);
            
            await cargarPedidos();
            
            const facturaData = {
                productos: [...carrito],
                total: total,
                cajero: usuario.nombre
            };
            
            try {
                await api.createFactura(resultado.id, usuario.id, total, facturaData);
            } catch (facturaError) {
                console.warn('Factura no guardada en BD:', facturaError);
            }
            
            setMostrarFactura({
                id: resultado.id,
                productos: [...carrito],
                total: total,
                fecha: new Date().toLocaleString(),
                cajero: usuario.nombre
            });
            setCarrito([]);
        } catch (error) {
            console.error('Error al crear pedido:', error);
            alert('Error al confirmar el pedido: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const cerrarFactura = () => {
        setMostrarFactura(null);
    };

    const marcarComoEntregado = async (idPedido) => {
        try {
            await api.updateEstadoPedido(idPedido, 'entregado');
            await cargarPedidos();
        } catch (error) {
            console.error('Error al marcar como entregado:', error);
            alert('Error al actualizar el pedido');
        }
    };

    const getEstadoBadge = (estado) => {
        switch (estado) {
            case 'en preparación': return 'badge-proceso';
            case 'listo': return 'badge-listo';
            case 'entregado': return 'badge-entregado';
            default: return 'badge-ninguno';
        }
    };

    const getEstadoTexto = (estado) => {
        switch (estado) {
            case 'en preparación': return 'En Proceso';
            case 'listo': return 'Listo para Servir';
            case 'entregado': return 'Entregado';
            default: return 'Pendiente';
        }
    };

    if (mostrarFacturas) {
        return <Facturas onClose={() => setMostrarFacturas(false)} />;
    }

    if (mostrarCierre) {
        return <CierreCaja usuario={usuario} onClose={() => setMostrarCierre(false)} onLogout={onLogout} />;
    }

    return (
        <div className="caja-container">
            <div className="caja-izquierda">
                {notificaciones.length > 0 && (
                    <div className="notificaciones">
                        {notificaciones.map(n => (
                            <div key={n.id} className="notificacion" onClick={() => marcarNotificacionLeida(n.id)}>
                                <span>⚠️ {n.mensaje}</span>
                                <button className="btn-notificacion">✕</button>
                            </div>
                        ))}
                    </div>
                )}
                <h2>Menú</h2>
                
                <div className="filtros">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        className="buscador"
                    />
                    <div className="categorias">
                        <button
                            className={categoria === 'todos' ? 'active' : ''}
                            onClick={() => setCategoria('todos')}
                        >Todos</button>
                        <button
                            className={categoria === 'pollo' ? 'active' : ''}
                            onClick={() => setCategoria('pollo')}
                        >Pollos</button>
                        <button
                            className={categoria === 'hamburguesa' ? 'active' : ''}
                            onClick={() => setCategoria('hamburguesa')}
                        >Hamburguesas</button>
                        <button
                            className={categoria === 'soda' ? 'active' : ''}
                            onClick={() => setCategoria('soda')}
                        >Sodas</button>
                    </div>
                </div>

                <div className="lista-productos">
                    {productosFiltrados.map(producto => (
                        <div key={producto.id} className="producto-card" onClick={() => agregarAlCarrito(producto)}>
                            <span className="producto-nombre">{producto.nombre}</span>
                            <span className="producto-precio">Bs. {producto.precio.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="caja-derecha">
                <div className="carrito-header">
                    <h2>Carrito</h2>
                    <div className="header-botones">
                        <button className="btn-facturas cierre" onClick={() => setMostrarCierre(true)}>
                            Cierre Caja
                        </button>
                        <button className="btn-facturas" onClick={() => setMostrarFacturas(true)}>
                            Ver Facturas
                        </button>
                    </div>
                </div>
                <div className="carrito-items">
                    {carrito.length === 0 ? (
                        <p className="carrito-vacio">Carrito vacío</p>
                    ) : (
                        carrito.map(item => (
                            <div key={item.id} className="carrito-item">
                                <div className="carrito-info">
                                    <span className="carrito-nombre">{item.nombre}</span>
                                    <span className="carrito-precio">Bs. {(item.precio * item.cantidad).toFixed(2)}</span>
                                </div>
                                <div className="carrito-cantidad">
                                    <button onClick={() => cambiarCantidad(item.id, -1)}>-</button>
                                    <span>{item.cantidad}</span>
                                    <button onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                                    <button className="btn-eliminar" onClick={() => eliminarDelCarrito(item.id)} title="Quitar del carrito">✕</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="carrito-total">
                    <span>Total:</span>
                    <span className="total-amount">Bs. {total.toFixed(2)}</span>
                </div>

                <button
                    className="btn-confirmar"
                    onClick={confirmarPedido}
                    disabled={loading || carrito.length === 0}
                >
                    {loading ? 'Confirmando...' : 'Confirmar Pedido'}
                </button>
            </div>

            {pedidos.length > 0 && (
                <div className="caja-pedidos">
                    <h3>Pedidos Activos</h3>
                    <div className="lista-pedidos">
                        {pedidos.map(pedido => (
                            <div key={pedido.id} className={`pedido-item ${getEstadoBadge(pedido.estado)}`}>
                                <div className="pedido-info">
                                    <span className="pedido-id">#{pedido.id}</span>
                                    <span className="pedido-fecha">
                                        {new Date(pedido.fecha).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="pedido-items-resumen">
                                    {pedido.detalles?.slice(0, 3).map((d, i) => (
                                        <span key={i}>{d.cantidad}x {d.producto}</span>
                                    ))}
                                    {pedido.detalles?.length > 3 && <span>...</span>}
                                </div>
                                <div className={`pedido-estado ${getEstadoBadge(pedido.estado)}`}>
                                    {getEstadoTexto(pedido.estado)}
                                </div>
                                {pedido.estado === 'listo' && (
                                    <button 
                                        className="btn-entregar"
                                        onClick={() => marcarComoEntregado(pedido.id)}
                                    >
                                        ✓ Marcar como Entregado
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {mostrarFactura && (
                <div className="modal-factura">
                    <div className="factura">
                        <h2>Doña Choca</h2>
                        <p className="factura-fecha">{mostrarFactura.fecha}</p>
                        <p className="factura-pedido">Pedido #{mostrarFactura.id}</p>
                        <p className="factura-cajero">Cajero: {mostrarFactura.cajero}</p>
                        <hr />
                        <div className="factura-items">
                            {mostrarFactura.productos.map((p, i) => (
                                <div key={i} className="factura-item">
                                    <span>{p.cantidad}x {p.nombre}</span>
                                    <span>Bs. {(p.precio * p.cantidad).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <hr />
                        <div className="factura-total">
                            <strong>TOTAL:</strong>
                            <strong>Bs. {mostrarFactura.total.toFixed(2)}</strong>
                        </div>
                        <button className="btn-cerrar" onClick={cerrarFactura}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Caja;
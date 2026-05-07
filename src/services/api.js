const API_URL = 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    getProductos: async () => {
        const response = await fetch(`${API_URL}/productos`);
        return response.json();
    },

    getPedidos: async (fecha_inicio, fecha_fin) => {
        let url = `${API_URL}/pedidos`;
        if (fecha_inicio && fecha_fin) {
            url += `?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`;
        }
        const response = await fetch(url, {
            headers: getHeaders()
        });
        return response.json();
    },

    getPedidosEnPreparacion: async () => {
        const response = await fetch(`${API_URL}/pedidos/en-preparacion`, {
            headers: getHeaders()
        });
        return response.json();
    },

    createPedido: async (id_usuario, productos) => {
        const response = await fetch(`${API_URL}/pedidos`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ id_usuario, productos })
        });
        return response.json();
    },

    updateEstadoPedido: async (id, estado) => {
        const response = await fetch(`${API_URL}/pedidos/${id}/estado`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ estado })
        });
        return response.json();
    },

    deletePedido: async (id) => {
        const response = await fetch(`${API_URL}/pedidos/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al eliminar pedido');
        }
        return response.json();
    },

    login: async (nombre, password) => {
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, password })
        });
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify({ 
                id: data.id, 
                nombre: data.nombre, 
                rol: data.rol 
            }));
        }
        return data;
    },

    logout: () => {
        localStorage.clear();
    },

    getReporteCaja: async (fecha) => {
        let url = `${API_URL}/reportes/caja`;
        if (fecha) url += `?fecha=${fecha}`;
        const response = await fetch(url, {
            headers: getHeaders()
        });
        return response.json();
    },

    getReportePlatos: async (fecha) => {
        let url = `${API_URL}/reportes/platos`;
        if (fecha) url += `?fecha=${fecha}`;
        const response = await fetch(url, {
            headers: getHeaders()
        });
        return response.json();
    },

    getReporteCajeros: async (fecha) => {
        let url = `${API_URL}/reportes/cajeros`;
        if (fecha) url += `?fecha=${fecha}`;
        const response = await fetch(url, {
            headers: getHeaders()
        });
        return response.json();
    },

    getFacturas: async (fecha_inicio, fecha_fin) => {
        let url = `${API_URL}/facturas`;
        if (fecha_inicio && fecha_fin) {
            url += `?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`;
        }
        const response = await fetch(url, {
            headers: getHeaders()
        });
        return response.json();
    },

    getFacturaById: async (id) => {
        const response = await fetch(`${API_URL}/facturas/${id}`, {
            headers: getHeaders()
        });
        return response.json();
    },

    createFactura: async (id_pedido, id_usuario, total, datos) => {
        const response = await fetch(`${API_URL}/facturas`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ id_pedido, id_usuario, total, datos })
        });
        return response.json();
    },

    getCierreCaja: async (id_usuario) => {
        const response = await fetch(`${API_URL}/reportes/cierre-caja?id_usuario=${id_usuario}`, {
            headers: getHeaders()
        });
        return response.json();
    },

    updateDisponibilidad: async (id, disponible, mensaje) => {
        const response = await fetch(`${API_URL}/productos/${id}/disponibilidad`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ disponible, mensaje })
        });
        return response.json();
    },

    getNotificaciones: async () => {
        const response = await fetch(`${API_URL}/notificaciones/no-leidas`, {
            headers: getHeaders()
        });
        return response.json();
    },

    markNotificacionLeida: async (id) => {
        const response = await fetch(`${API_URL}/notificaciones/${id}/leida`, {
            method: 'PUT',
            headers: getHeaders()
        });
        return response.json();
    },

    deleteUsuario: async (id) => {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return response.json();
    },

    updatePasswordUsuario: async (id, password) => {
        const response = await fetch(`${API_URL}/usuarios/${id}/password`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ password })
        });
        return response.json();
    },

    getReporteCajaFechas: async (fecha_inicio, fecha_fin) => {
        const response = await fetch(`${API_URL}/reportes/caja-fechas?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`, {
            headers: getHeaders()
        });
        return response.json();
    },

    getReporteSemanal: async () => {
        const response = await fetch(`${API_URL}/reportes/semanal`, {
            headers: getHeaders()
        });
        return response.json();
    },

    getReporteMensual: async () => {
        const response = await fetch(`${API_URL}/reportes/mensual`, {
            headers: getHeaders()
        });
        return response.json();
    },

    getReporteInventario: async (fecha_inicio, fecha_fin) => {
        const url = fecha_inicio && fecha_fin 
            ? `${API_URL}/reportes/inventario?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`
            : `${API_URL}/reportes/inventario`;
        const response = await fetch(url, {
            headers: getHeaders()
        });
        return response.json();
    }
};
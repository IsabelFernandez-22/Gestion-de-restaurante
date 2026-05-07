const pool = require('../config/database');

const reportesController = {
    getReporteCaja: async (req, res) => {
        const { fecha_inicio, fecha_fin, fecha } = req.query;
        const fechaUsar = fecha || (fecha_inicio && fecha_fin ? fecha_inicio : null);
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    COUNT(*) as total_pedidos,
                    SUM(total) as total_ventas
                FROM pedidos 
                WHERE DATE(fecha) = COALESCE(?, CURDATE())
            `, [fechaUsar]);
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getReporteCajaFechas: async (req, res) => {
        const { fecha_inicio, fecha_fin } = req.query;
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    DATE(fecha) as fecha,
                    COUNT(*) as total_pedidos,
                    SUM(total) as total_ventas
                FROM pedidos 
                WHERE DATE(fecha) BETWEEN ? AND ?
                GROUP BY DATE(fecha)
                ORDER BY fecha DESC
            `, [fecha_inicio, fecha_fin]);
            
            const [totales] = await pool.execute(`
                SELECT 
                    COUNT(*) as total_pedidos,
                    SUM(total) as total_ventas
                FROM pedidos 
                WHERE DATE(fecha) BETWEEN ? AND ?
            `, [fecha_inicio, fecha_fin]);

            res.json({ dias: rows, totales: totales[0] });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getReporteSemanal: async (req, res) => {
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    YEARWEEK(fecha, 1) as semana,
                    MIN(DATE(fecha)) as fecha_inicio,
                    MAX(DATE(fecha)) as fecha_fin,
                    COUNT(*) as total_pedidos,
                    SUM(total) as total_ventas
                FROM pedidos 
                WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK)
                GROUP BY YEARWEEK(fecha, 1)
                ORDER BY semana DESC
            `);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getReporteMensual: async (req, res) => {
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    YEAR(fecha) as año,
                    MONTH(fecha) as mes,
                    DATE_FORMAT(fecha, '%Y-%m') as mes_formato,
                    COUNT(*) as total_pedidos,
                    SUM(total) as total_ventas
                FROM pedidos 
                WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
                GROUP BY YEAR(fecha), MONTH(fecha)
                ORDER BY año DESC, mes DESC
            `);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getReportePlatos: async (req, res) => {
        const { fecha } = req.query;
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    pr.nombre,
                    pr.categoria,
                    SUM(dp.cantidad) as cantidad_vendida,
                    SUM(dp.subtotal) as total_vendido
                FROM detalle_pedidos dp
                JOIN productos pr ON dp.id_producto = pr.id
                JOIN pedidos p ON dp.id_pedido = p.id
                WHERE DATE(p.fecha) = COALESCE(?, CURDATE())
                GROUP BY pr.id, pr.nombre, pr.categoria
                ORDER BY cantidad_vendida DESC
            `, [fecha || null]);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getReporteInventario: async (req, res) => {
        const { fecha_inicio, fecha_fin } = req.query;
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    pr.id,
                    pr.nombre,
                    pr.categoria,
                    SUM(dp.cantidad) as cantidad_vendida,
                    SUM(dp.subtotal) as total_vendido
                FROM detalle_pedidos dp
                JOIN productos pr ON dp.id_producto = pr.id
                JOIN pedidos p ON dp.id_pedido = p.id
                WHERE DATE(p.fecha) BETWEEN COALESCE(?, DATE_SUB(CURDATE(), INTERVAL 30 DAY)) AND COALESCE(?, CURDATE())
                GROUP BY pr.id, pr.nombre, pr.categoria
                ORDER BY cantidad_vendida DESC
            `, [fecha_inicio, fecha_fin]);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getReporteCajeros: async (req, res) => {
        const { fecha } = req.query;
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    u.id,
                    u.nombre,
                    u.rol,
                    COUNT(p.id) as total_pedidos,
                    COALESCE(SUM(p.total), 0) as total_ventas
                FROM usuarios u
                LEFT JOIN pedidos p ON u.id = p.id_usuario AND DATE(p.fecha) = COALESCE(?, CURDATE())
                WHERE u.rol = 'cajero'
                GROUP BY u.id, u.nombre, u.rol
                ORDER BY total_ventas DESC
            `, [fecha || null]);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getCierreCaja: async (req, res) => {
        const { id_usuario } = req.query;
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    COUNT(*) as total_pedidos,
                    SUM(total) as total_ventas,
                    MIN(fecha) as hora_inicio,
                    MAX(fecha) as hora_fin
                FROM pedidos 
                WHERE id_usuario = ? AND DATE(fecha) = CURDATE()
            `, [id_usuario]);

            const [productosVendidos] = await pool.execute(`
                SELECT 
                    pr.nombre,
                    pr.categoria,
                    SUM(dp.cantidad) as cantidad
                FROM detalle_pedidos dp
                JOIN productos pr ON dp.id_producto = pr.id
                JOIN pedidos p ON dp.id_pedido = p.id
                WHERE p.id_usuario = ? AND DATE(p.fecha) = CURDATE()
                GROUP BY pr.id, pr.nombre, pr.categoria
                ORDER BY cantidad DESC
            `, [id_usuario]);

            res.json({
                ...rows[0],
                productos: productosVendidos
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = reportesController;
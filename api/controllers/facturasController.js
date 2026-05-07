const pool = require('../config/database');

const facturasController = {
    create: async (req, res) => {
        const { id_pedido, id_usuario, total, datos } = req.body;
        try {
            const [result] = await pool.execute(
                'INSERT INTO facturas (id_pedido, id_usuario, total, datos) VALUES (?, ?, ?, ?)',
                [id_pedido, id_usuario, total, JSON.stringify(datos)]
            );
            res.status(201).json({ id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAll: async (req, res) => {
        const { fecha_inicio, fecha_fin } = req.query;
        let where = '';
        let params = [];
        if (fecha_inicio && fecha_fin) {
            where = 'WHERE DATE(f.fecha) BETWEEN ? AND ?';
            params = [fecha_inicio, fecha_fin];
        }
        try {
            const [rows] = await pool.execute(`
                SELECT f.*, u.nombre as nombre_usuario 
                FROM facturas f 
                JOIN usuarios u ON f.id_usuario = u.id 
                ${where}
                ORDER BY f.fecha DESC
            `, params);
            
            const facturas = rows.map(f => ({
                ...f,
                datos: JSON.parse(f.datos)
            }));
            
            res.json(facturas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        const { id } = req.params;
        try {
            const [rows] = await pool.execute('SELECT * FROM facturas WHERE id = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Factura no encontrada' });
            }
            const factura = {
                ...rows[0],
                datos: JSON.parse(rows[0].datos)
            };
            res.json(factura);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = facturasController;
const pool = require('../config/database');

const notificacionesController = {
    getAll: async (req, res) => {
        try {
            const [rows] = await pool.execute(`
                SELECT n.*, p.nombre as nombre_producto 
                FROM notificaciones n
                JOIN productos p ON n.id_producto = p.id
                ORDER BY n.created_at DESC
            `);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    markLeida: async (req, res) => {
        const { id } = req.params;
        try {
            await pool.execute('UPDATE notificaciones SET leida = 1 WHERE id = ?', [id]);
            res.json({ message: 'Notificación marcada como leída' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getNoLeidas: async (req, res) => {
        try {
            const [rows] = await pool.execute(`
                SELECT n.*, p.nombre as nombre_producto 
                FROM notificaciones n
                JOIN productos p ON n.id_producto = p.id
                WHERE n.leida = 0
                ORDER BY n.created_at DESC
            `);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = notificacionesController;
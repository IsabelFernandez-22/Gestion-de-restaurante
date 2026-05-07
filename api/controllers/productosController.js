const pool = require('../config/database');

const productosController = {
    getAll: async (req, res) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM productos ORDER BY categoria, nombre');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        const { id } = req.params;
        try {
            const [rows] = await pool.execute('SELECT * FROM productos WHERE id = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateDisponibilidad: async (req, res) => {
        const { id } = req.params;
        const { disponible, mensaje } = req.body;
        try {
            await pool.execute('UPDATE productos SET disponible = ? WHERE id = ?', [disponible ? 1 : 0, id]);
            
            if (!disponible && mensaje) {
                await pool.execute(
                    'INSERT INTO notificaciones (id_producto, mensaje) VALUES (?, ?)',
                    [id, mensaje]
                );
            }
            
            res.json({ message: 'Disponibilidad actualizada' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = productosController;
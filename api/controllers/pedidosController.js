const pool = require('../config/database');

const pedidosController = {
    getAll: async (req, res) => {
        const { fecha_inicio, fecha_fin } = req.query;
        let where = '';
        let params = [];
        if (fecha_inicio && fecha_fin) {
            where = 'WHERE DATE(p.fecha) BETWEEN ? AND ?';
            params = [fecha_inicio, fecha_fin];
        }
        try {
            const [pedidos] = await pool.execute(`
                SELECT p.*, u.nombre as nombre_usuario 
                FROM pedidos p 
                JOIN usuarios u ON p.id_usuario = u.id 
                ${where}
                ORDER BY p.fecha DESC
            `, params);

            for (let pedido of pedidos) {
                const [detalles] = await pool.execute(`
                    SELECT dp.cantidad, dp.subtotal, pr.nombre as producto
                    FROM detalle_pedidos dp
                    JOIN productos pr ON dp.id_producto = pr.id
                    WHERE dp.id_pedido = ?
                `, [pedido.id]);
                pedido.detalles = detalles;
            }

            res.json(pedidos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    create: async (req, res) => {
        const { id_usuario, productos } = req.body;
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            let total = 0;
            for (const item of productos) {
                const [productos] = await connection.execute(
                    'SELECT precio FROM productos WHERE id = ?',
                    [item.id_producto]
                );
                total += productos[0].precio * item.cantidad;
            }

            const [result] = await connection.execute(
                'INSERT INTO pedidos (id_usuario, total) VALUES (?, ?)',
                [id_usuario, total]
            );

            const id_pedido = result.insertId;

            for (const item of productos) {
                const [productos] = await connection.execute(
                    'SELECT precio FROM productos WHERE id = ?',
                    [item.id_producto]
                );
                const subtotal = productos[0].precio * item.cantidad;
                await connection.execute(
                    'INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, subtotal) VALUES (?, ?, ?, ?)',
                    [id_pedido, item.id_producto, item.cantidad, subtotal]
                );
            }

            await connection.commit();
            res.status(201).json({ id: id_pedido, total });
        } catch (error) {
            await connection.rollback();
            res.status(500).json({ error: error.message });
        } finally {
            connection.release();
        }
    },

    updateEstado: async (req, res) => {
        const { id } = req.params;
        const { estado } = req.body;
        try {
            await pool.execute('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
            res.json({ message: 'Estado actualizado' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    delete: async (req, res) => {
        const { id } = req.params;
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            await connection.execute('DELETE FROM facturas WHERE id_pedido = ?', [id]);
            await connection.execute('DELETE FROM detalle_pedidos WHERE id_pedido = ?', [id]);
            await connection.execute('DELETE FROM pedidos WHERE id = ?', [id]);
            await connection.commit();
            res.json({ message: 'Pedido eliminado' });
        } catch (error) {
            await connection.rollback();
            res.status(500).json({ error: error.message });
        } finally {
            connection.release();
        }
    },

    getEnPreparacion: async (req, res) => {
        try {
            const [pedidos] = await pool.execute(`
                SELECT p.*, u.nombre as nombre_usuario 
                FROM pedidos p 
                JOIN usuarios u ON p.id_usuario = u.id 
                WHERE p.estado = 'en preparación'
                ORDER BY p.fecha ASC
            `);

            for (let pedido of pedidos) {
                const [detalles] = await pool.execute(`
                    SELECT dp.cantidad, dp.subtotal, pr.nombre as producto
                    FROM detalle_pedidos dp
                    JOIN productos pr ON dp.id_producto = pr.id
                    WHERE dp.id_pedido = ?
                `, [pedido.id]);
                pedido.detalles = detalles;
            }

            res.json(pedidos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = pedidosController;
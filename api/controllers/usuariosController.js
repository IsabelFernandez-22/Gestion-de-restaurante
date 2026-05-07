const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'dona_choca_2024_secret_key';

const usuariosController = {
    login: async (req, res) => {
        const { nombre, password } = req.body;
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM usuarios WHERE nombre = ?',
                [nombre]
            );
            if (rows.length === 0) {
                return res.status(401).json({ error: 'Usuario no encontrado' });
            }
            const usuario = rows[0];
            const match = await bcrypt.compare(password, usuario.password);
            if (!match) {
                return res.status(401).json({ error: 'Password incorrecto' });
            }
            const token = jwt.sign(
                { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
                SECRET_KEY,
                { expiresIn: '8h' }
            );
            res.json({ 
                id: usuario.id, 
                nombre: usuario.nombre, 
                rol: usuario.rol || 'cajero',
                token 
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const [rows] = await pool.execute('SELECT id, nombre, rol, created_at FROM usuarios');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    create: async (req, res) => {
        const { nombre, password, rol } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await pool.execute(
                'INSERT INTO usuarios (nombre, password, rol) VALUES (?, ?, ?)',
                [nombre, hashedPassword, rol || 'cajero']
            );
            res.status(201).json({ id: result.insertId, nombre, rol: rol || 'cajero' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    delete: async (req, res) => {
        const { id } = req.params;
        try {
            await pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);
            res.json({ message: 'Usuario eliminado' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updatePassword: async (req, res) => {
        const { id } = req.params;
        const { password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.execute('UPDATE usuarios SET password = ? WHERE id = ?', [hashedPassword, id]);
            res.json({ message: 'Password actualizado' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = usuariosController;
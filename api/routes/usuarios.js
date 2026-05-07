const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const authMiddleware = require('../middleware/auth');

router.post('/login', usuariosController.login);
router.get('/', authMiddleware, usuariosController.getAll);
router.post('/', authMiddleware, usuariosController.create);
router.delete('/:id', authMiddleware, usuariosController.delete);
router.put('/:id/password', authMiddleware, usuariosController.updatePassword);

module.exports = router;
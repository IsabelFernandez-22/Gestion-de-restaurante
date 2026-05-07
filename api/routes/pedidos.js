const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, pedidosController.getAll);
router.get('/en-preparacion', authMiddleware, pedidosController.getEnPreparacion);
router.post('/', authMiddleware, pedidosController.create);
router.put('/:id/estado', authMiddleware, pedidosController.updateEstado);
router.delete('/:id', authMiddleware, pedidosController.delete);

module.exports = router;
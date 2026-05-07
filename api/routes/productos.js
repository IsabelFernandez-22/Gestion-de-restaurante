const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const authMiddleware = require('../middleware/auth');

router.get('/', productosController.getAll);
router.get('/:id', authMiddleware, productosController.getById);
router.put('/:id/disponibilidad', authMiddleware, productosController.updateDisponibilidad);

module.exports = router;
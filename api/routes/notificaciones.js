const express = require('express');
const router = express.Router();
const notificacionesController = require('../controllers/notificacionesController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, notificacionesController.getAll);
router.get('/no-leidas', authMiddleware, notificacionesController.getNoLeidas);
router.put('/:id/leida', authMiddleware, notificacionesController.markLeida);

module.exports = router;
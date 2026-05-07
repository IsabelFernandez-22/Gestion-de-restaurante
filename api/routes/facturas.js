const express = require('express');
const router = express.Router();
const facturasController = require('../controllers/facturasController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, facturasController.getAll);
router.get('/:id', authMiddleware, facturasController.getById);
router.post('/', authMiddleware, facturasController.create);

module.exports = router;
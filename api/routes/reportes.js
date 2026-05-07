const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');
const authMiddleware = require('../middleware/auth');

router.get('/caja', authMiddleware, reportesController.getReporteCaja);
router.get('/caja-fechas', authMiddleware, reportesController.getReporteCajaFechas);
router.get('/semanal', authMiddleware, reportesController.getReporteSemanal);
router.get('/mensual', authMiddleware, reportesController.getReporteMensual);
router.get('/platos', authMiddleware, reportesController.getReportePlatos);
router.get('/inventario', authMiddleware, reportesController.getReporteInventario);
router.get('/cajeros', authMiddleware, reportesController.getReporteCajeros);
router.get('/cierre-caja', authMiddleware, reportesController.getCierreCaja);

module.exports = router;
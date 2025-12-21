const express = require('express');
const router = express.Router();
const controller = require('../controllers/empleado.controller');

router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.delete('/:id', controller.remove);
router.put('/:id', controller.update);

module.exports = router;

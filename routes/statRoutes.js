const express = require('express');
const statController = require('../controllers/statController');

const router = express.Router();

router.get('totalview/:id', statController.getVdoViewCount);

module.exports = router;
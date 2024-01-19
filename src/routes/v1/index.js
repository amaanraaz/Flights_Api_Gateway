const express = require('express');

const { InfoController } = require('../../controllers');
const UserRouter = require('./user-routes')

const router = express.Router();

router.use('/user',UserRouter);

router.get('/info', InfoController.info);

module.exports = router;
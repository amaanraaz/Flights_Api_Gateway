const express = require('express');

const { InfoController } = require('../../controllers');
const UserRouter = require('./user-routes')
const {AuthMiddleware} = require('../../middlewares')

const router = express.Router();

router.use('/user',UserRouter);

router.get('/info', AuthMiddleware.checkAuth , InfoController.info);

module.exports = router;
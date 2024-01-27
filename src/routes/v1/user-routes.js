const express = require('express');

const router = express.Router();
const {UserController} = require('../../controllers');
const {AuthMiddleware} = require('../../middlewares')

router.post('/signup', AuthMiddleware.validateAuthRequest, UserController.signUp);
router.post('/signin', AuthMiddleware.validateAuthRequest, UserController.signIn);
router.post('/role', UserController.addRoleToUser);

module.exports = router;
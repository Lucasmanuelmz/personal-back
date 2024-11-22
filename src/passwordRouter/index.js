const express = require('express');
const passwordRouter = express.Router();
const passwordController = require('../controllers/passwordController')

passwordRouter.post('/forgot-password', passwordController.forgotPassword);
passwordRouter.get('/reset-password/:token', passwordController.resetPassword);
passwordRouter.post('/reset-password/:token', passwordController.resetPasswordToken);

module.exports = passwordRouter;
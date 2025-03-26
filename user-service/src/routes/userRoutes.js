const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', userController.register); //
router.post('/login', authController.login);

// User routes
router.get(
    '/getAllUsers',
    authMiddleware.verifyToken,
    authMiddleware.checkRole(['ADMIN']),
    userController.getAllUsers
  );
router.get('/getUser/:id', 
    authMiddleware.verifyToken,
    userController.getUserById);

module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// AUTH ROUTES
router.post('/login', authController.login);

// USER ROUTES
router.post('/register', userController.register); //
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
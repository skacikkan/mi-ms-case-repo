const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    { expiresIn: '8h' }
  );
};

const userController = {
  // Kullanıcı kaydı
  async register(req, res) {
    try {
      const { username, email, password, firstName, lastName, role } = req.body;
      
      // Email formatı kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      
      // Kullanıcının zaten var olup olmadığını kontrol etme
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }
      
      // Yeni kullanıcı oluşturma
      const newUser = await userModel.create({
        username,
        email,
        password,
        firstName,
        lastName,
        role
      });
      
      // Token oluşturma
      const token = generateToken(newUser);
      
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  },
  
  // Tüm kullanıcıları getirme
  async getAllUsers(req, res) {
    try {
      const users = await userModel.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({ error: 'Failed to get users' });
    }
  },
  
  // Kullanıcı ID'si ile kullanıcıyı getirme
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userModel.findById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  }
  
  // Diğer CRUD işlemleri...
};

module.exports = userController;
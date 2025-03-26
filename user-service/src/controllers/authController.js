const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

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

const authController = {
  // Kullanıcı girişi
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Kullanıcıyı bulma
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Şifre kontrolü
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Token oluşturma
      const token = generateToken(user);
      
      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  }
};

module.exports = authController;
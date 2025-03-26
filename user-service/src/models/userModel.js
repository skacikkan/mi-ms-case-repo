const db = require('../config/db');
const bcrypt = require('bcrypt');

const userModel = {
  // Kullanıcı oluşturma
  async create(userData) {
    const { username, email, password, firstName, lastName, role } = userData;
    
    // Şifreyi hash'leme
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (username, email, password, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, email, first_name, last_name, role, created_at
    `;
    
    const values = [username, email, hashedPassword, firstName, lastName, role || 'SALES_REP'];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  // Kullanıcıyı email ile bulma
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    
    try {
      const result = await db.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },
  
  // Kullanıcıyı ID ile bulma
  async findById(id) {
    const query = 'SELECT id, username, email, first_name, last_name, role, created_at FROM users WHERE id = $1';
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  },
  
  // Tüm kullanıcıları getirme
  async findAll() {
    const query = 'SELECT id, username, email, first_name, last_name, role, created_at FROM users';
    
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error finding all users:', error);
      throw error;
    }
  }
  
  // Diğer CRUD metotları...
};

module.exports = userModel;
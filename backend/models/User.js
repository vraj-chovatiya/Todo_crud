const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async findByEmail(email) {
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            return rows[0];
        } catch (err) {
            throw new Error(err);
        }
    }

    static async findByUsername(username) {
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
            return rows[0];
        } catch (err) {
            throw new Error(err);
        }
    }

    static async findById(id) {
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
            return rows[0];
        } catch (err) {
            throw new Error(err);
        }
    }

    static async create(user) {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const [result] = await pool.query('INSERT INTO users (username, email, password, profile_image) VALUES (?, ?, ?, ?)', [user.username, user.email, hashedPassword, user.profileImage || null]);
            return result.insertId;
        } catch (err) {
            throw new Error(err);
        }
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    static async update(user) {
        try {
            const [result] = await pool.query('UPDATE users SET username = ?, email = ?, profile_image = ? WHERE id = ?', [user.username, user.email, user.profileImage, user.id]);
            return result.affectedRows;
        } catch (err) {
            throw new Error(err);
        }
    }
}


module.exports = User;
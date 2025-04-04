const { pool } = require('../config/db');

class Todo {
    static async create({ todoData }) {
        try {
            const [result] = await pool.query('INSERT INTO todos (user_id, description) values (?, ?)', [todoData.userId, todoData.description]);
            return result.insertId;
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = Todo;
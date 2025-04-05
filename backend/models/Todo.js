const { pool } = require('../config/db');

class Todo {
    static async create(userId, description ) {
        try {
            const [result] = await pool.query('INSERT INTO todos (user_id, description) values (?, ?)', [userId.id, description.description]);
            return result.insertId;
        } catch (error) {
            console.log("error throwing from here...");
            throw new Error(error);
        }
    }

    static async getAll(userId) {
        const user  = userId.id;
        try {
            const [rows] = await pool.query('SELECT * from todos where user_id = ?', [user]);
            return rows;
        } catch (err) {
            throw new Error(err);
        }
    }

    static async updateTodo({todoId, description, userId}){
        // console.log("this is inside update class", todoId, description, userId);
        try {
            const [result] = await pool.query('UPDATE todos set description = ? where id = ? and user_id = ?', [description, todoId, userId.id]);
            if(result.affectedRows === 0) {
                throw new Error('Todo not found or not authorized to update');
            }
            return result;
        }catch(err){
            throw new Error(err);
        }
    }

    static async deleteTodo(todoId, userId){
        try{
            const [result] = await pool.query('delete from todos where id = ? and user_id = ?', [todoId.id, userId.id]);
            if(result.affectedRows === 0){
                throw new Error('Todo not found or not authorized to delete');
            }
            return result;
        }catch(error){
            throw new Error(error);
        }
    }
}

module.exports = Todo;
const Todo = require('../models/Todo');

exports.createTodo = async (req, res) => {
    try {
        const { description } = req.body;
        const userId = req.user.id;
        const todoId = await Todo.create({ userId: req.user.id, description });
        if (todoId) {
            return res.status(201).json({ message: 'Todo created successfully' });
        }
        return res.status(500).json({ message: 'Failed to create todo' });
    } catch (err) {
        console.log("Error on creating todo", err);
        return res.status(500).json({ message: 'Server error' });
    }
}
const Todo = require('../models/Todo');

exports.createTodo = async (req, res) => {
    try {
        const description = req.body;
        const userId = req.user;
        const todoId = await Todo.create( userId, description);
        if (todoId) {
            return res.status(201).json({ message: 'Todo created successfully' });
        }else{
            return res.status(500).json({ message: 'Failed to create todo' });
        }
    } catch (err) {
        console.log("Error on creating todo", err);
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.getTodos = async (req, res) => {
    try{
        const userId = req.user;
        const todos = await Todo.getAll(userId);
        if(todos.length > 0){
            return res.status(200).json({todos});
        }else{
            return res.status(404).json({message: 'No todos found'});
        }
    }catch(err){
        console.log("Error on getting todos", err);
        return res.status(500).json({message: 'Server error'});
    }
}

exports.updateTodo = async (req, res) => {
    try{
    const todoId = req.params.id;
    const description = req.body.description;
    // const {todoId, description} = req.body;
    const userId = req.user;
    // console.log("thisi si for what im getting", todoId, description, userId);
    const updatedTodo = await Todo.updateTodo({todoId, description, userId});
    
    if(updatedTodo.affectedRows > 0){
        return res.status(200).json({message: 'Todo updated successfully'});
    }else{
        return res.status(404).json({message: 'Todo not found or not authorized to update'});
    }
    }catch(err){
        console.log("Error on updating todo", err);
        return res.status(500).json({message: 'Server error'});
    }
}

exports.deleteTodo = async (req, res) => {
    try{
        const todoId = req.params;
        const userId = req.user;
        const deletedTodo = await Todo.deleteTodo(todoId, userId);
        if(deletedTodo.affectedRows > 0){
            return res.status(200).json({message: 'Todo deleted successfully'});
        }else{
            return res.status(404).json({message: 'Todo not found or not authorized to delete'});
        }
    }catch(err){
        console.log("Error on deleting todo", err);
        return res.status(500).json({message: 'Server error'});
    }
}
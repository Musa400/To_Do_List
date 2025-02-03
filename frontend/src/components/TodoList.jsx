import React, { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../services/todoService';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const fetchedTodos = await getTodos();
      setTodos(fetchedTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTodo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTodo) {
        await updateTodo(editingTodo._id, newTodo);
        setEditingTodo(null);
      } else {
        await createTodo(newTodo);
      }
      setNewTodo({ title: '', description: '' });
      fetchTodos();
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setNewTodo({ title: todo.title, description: todo.description });
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      await updateTodo(todo._id, { completed: !todo.completed });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="todo-list-container">
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Todo Title"
          value={newTodo.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Todo Description"
          value={newTodo.description}
          onChange={handleInputChange}
        />
        <button type="submit">
          {editingTodo ? 'Update Todo' : 'Add Todo'}
        </button>
      </form>

      <div className="todos">
        {todos.map(todo => (
          <div 
            key={todo._id} 
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
          >
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <div className="todo-actions">
              <input 
                type="checkbox" 
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo)}
              />
              <button onClick={() => handleEdit(todo)}>Edit</button>
              <button onClick={() => handleDelete(todo._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoList;

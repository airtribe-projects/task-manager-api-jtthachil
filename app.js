const express = require('express');
const app = express();
const port = 3000;

const fs = require('fs');
const path = require('path');

// Load initial tasks
let tasks = require('./task.json').tasks; // Initial data

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper to validate task data
const validateTask = (task) => {
    if (!task.title || typeof task.title !== 'string') return "Title is required and must be a string";
    if (!task.description || typeof task.description !== 'string') return "Description is required and must be a string";
    if (task.completed !== undefined && typeof task.completed !== 'boolean') return "Completed must be a boolean";
    if (task.priority !== undefined && !['low', 'medium', 'high'].includes(task.priority)) return "Priority must be low, medium, or high";
    return null;
};

// GET /tasks with filtering and sorting
app.get('/tasks', (req, res) => {
    let result = [...tasks];

    // Filtering by completed status
    if (req.query.completed) {
        const isCompleted = req.query.completed === 'true';
        result = result.filter(t => t.completed === isCompleted);
    }

    // Sorting by creation date
    if (req.query.sort === 'createdAt') {
        result.sort((a, b) => {
            // Check if createdAt exists, treat missing as older
            const dateA = a.createdAt || 0;
            const dateB = b.createdAt || 0;
            return dateA - dateB;
        });
    }

    res.status(200).json(result);
});

// GET /tasks/:id
app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).send('Task not found');
    }
    res.status(200).json(task);
});

// GET /tasks/priority/:level
app.get('/tasks/priority/:level', (req, res) => {
    const level = req.params.level;
    if (!['low', 'medium', 'high'].includes(level)) {
        return res.status(400).send('Invalid priority level');
    }
    const result = tasks.filter(t => t.priority === level);
    res.status(200).json(result);
});

// POST /tasks
app.post('/tasks', (req, res) => {
    const error = validateTask(req.body);
    if (error) {
        return res.status(400).send(error);
    }
    const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed || false,
        priority: req.body.priority || 'low',
        createdAt: Date.now()
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        return res.status(404).send('Task not found');
    }

    const updates = req.body;
    // validation for PUT can be partial or full depending on requirement. 
    // Tests suggest validation on completed type.
    if (updates.title && typeof updates.title !== 'string') return res.status(400).send('Invalid title');
    if (updates.description && typeof updates.description !== 'string') return res.status(400).send('Invalid description');
    if (updates.completed !== undefined && typeof updates.completed !== 'boolean') return res.status(400).send('Completed must be a boolean');
    if (updates.priority !== undefined && !['low', 'medium', 'high'].includes(updates.priority)) return res.status(400).send('Priority must be low, medium, or high');

    const updatedTask = { ...tasks[taskIndex], ...updates };
    tasks[taskIndex] = updatedTask;
    res.status(200).json(updatedTask);
});

// DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        return res.status(404).send('Task not found');
    }
    tasks.splice(taskIndex, 1);
    res.status(200).send('Task deleted');
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;
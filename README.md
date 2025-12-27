# Task Manager API

A robust RESTful API for managing tasks, built with Node.js and Express. It supports full CRUD operations, advanced filtering, sorting, and priority management, using an in-memory data store for simplicity and speed.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete tasks.
- **Input Validation**: Ensures data integrity for all incoming requests.
- **Error Handling**: Provides clear and descriptive error messages.
- **Filtering**: Retrieve tasks based on their completion status.
- **Sorting**: Order tasks chronologically by creation date.
- **Priority System**: Categorize tasks by `low`, `medium`, or `high` priority.

## Tech Stack

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **Tap**: Testing framework.

## Prerequisites

Ensure you have the following installed on your system:
- Node.js (v18 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd task-manager-api
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Start the development server:
```bash
npm start
```
The server will start on `http://localhost:3000`.

## API Reference

### Base URL
`http://localhost:3000`

### 1. Retrieve Tasks
Fetch all tasks, with optional filtering and sorting.

- **Endpoint:** `/tasks`
- **Method:** `GET`
- **Query Parameters:**
    - `completed` (boolean): Filter tasks by status. Example: `?completed=true`
    - `sort` (string): Set to `createdAt` to sort by creation time (ascending).
- **Success Response:** `200 OK`
    ```json
    [
      {
        "id": 1,
        "title": "Setup Check",
        "description": "Ensure env is ready",
        "completed": true,
        "priority": "high",
        "createdAt": 1672531200000
      }
    ]
    ```

### 2. Retrieve Single Task
Fetch a specific task by its unique ID.

- **Endpoint:** `/tasks/:id`
- **Method:** `GET`
- **Success Response:** `200 OK`
- **Error Response:** `404 Not Found` if the ID does not exist.

### 3. Retrieve Tasks by Priority
Fetch all tasks matching a specific priority level.

- **Endpoint:** `/tasks/priority/:level`
- **Method:** `GET`
- **URL Parameters:** `level` (required) - `low`, `medium`, or `high`.
- **Success Response:** `200 OK`
- **Error Response:** `400 Bad Request` if an invalid priority level is provided.

### 4. Create Task
Add a new task to the list.

- **Endpoint:** `/tasks`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body Parameters:**
    - `title` (string, required): The name of the task.
    - `description` (string, required): Details about the task.
    - `completed` (boolean, optional): Default is `false`.
    - `priority` (string, optional): One of `low`, `medium`, `high`. Default is `low`.
- **Success Response:** `201 Created`
- **Error Response:** `400 Bad Request` if validation fails.

### 5. Update Task
Modify an existing task.

- **Endpoint:** `/tasks/:id`
- **Method:** `PUT`
- **Headers:** `Content-Type: application/json`
- **Body Parameters:**  (All are optional, but must be valid types if provided)
    - `title` (string)
    - `description` (string)
    - `completed` (boolean)
    - `priority` (string): Must be `low`, `medium`, or `high`.
- **Success Response:** `200 OK`
- **Error Response:** 
    - `400 Bad Request` for invalid data types.
    - `404 Not Found` if ID does not exist.

### 6. Delete Task
Remove a task permanently.

- **Endpoint:** `/tasks/:id`
- **Method:** `DELETE`
- **Success Response:** `200 OK`
- **Error Response:** `404 Not Found`

## Testing

This project uses `tap` for automated testing.

Run the test suite:
```bash
npm test
```
This checks all endpoints, validation rules, and error conditions.

## Project Structure

- `app.js`: Main application file containing API logic and routes.
- `package.json`: Project configuration and dependencies.
- `task.json`: Initial dataset loaded into memory on server start.
- `test/`: Directory containing automated test files.

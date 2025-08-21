This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

# Task Management App

This is a Task Management application that allows users to manage tasks in a board with lists. It supports CRUD operations (Create, Read, Update, Delete) for tasks and lists. The backend is powered by **Supabase** and the frontend is built with **Next.js**.

## Features

- **Board Management**: Users can create and manage boards.
- **List Management**: Users can add, update, and delete lists.
- **Task Management**: Users can add, edit, update, and delete tasks within a list.
- **UI**: User-friendly interface with options to edit and delete tasks and lists, with toast notifications.

## Tech Stack

- **Frontend**: React (Next.js), Tailwind CSS
- **Backend**: Supabase (PostgreSQL), Next.js API Routes
- **UI Components**: Tailwind CSS, React Icons

## Installation

To get started with this project, follow the steps below:

### Prerequisites

- **Node.js** (version 14.x or above)
- **Yarn** or **npm**
- **Supabase Account** for database setup.

## API Documentation

This section covers the available API endpoints for the Task Management Application. Each endpoint allows you to manage boards, lists, and tasks, including their CRUD operations.

### 1. Fetch Board, Lists, and Tasks

**Endpoint**: `GET /api/boards`

**Description**: Fetches the details of a board along with its lists and tasks.

#### Request:

- **Method**: `GET`
- **URL**: `/api/boards`

#### Response:

```json
{
  "board": {
    "id": "board-id",
    "title": "Board Title",
    "created_at": "2023-05-01T00:00:00.000Z"
  },
  "lists": [
    {
      "id": "list-id-1",
      "title": "List 1",
      "board_id": "board-id",
      "created_at": "2023-05-01T00:00:00.000Z"
    }
  ],
  "tasks": [
    {
      "id": "task-id-1",
      "title": "Task 1",
      "description": "Task 1 description",
      "list_id": "list-id-1",
      "created_at": "2023-05-01T00:00:00.000Z"
    }
  ]
}
```
### 2. Create a New List

**Endpoint**: `POST /api/lists`

**Description**: Creates a new list in a board.

#### Request:

- **Method**: `POST`
- **URL**: `/api/lists`

#### Body:

```json
{
  "boardId": "board-id",
  "title": "New List"
}
```
### Response:
```json
{
  "message": "List created successfully",
  "data": {
    "id": "new-list-id",
    "title": "New List",
    "board_id": "board-id",
    "created_at": "2023-05-01T00:00:00.000Z"
  }
}
```
### 3. Delete a List and its Tasks

**Endpoint**: `DELETE /api/lists/[listId]`

**Description**: Deletes a list along with all tasks associated with it.

#### Request:

- **Method**: `DELETE`
- **URL**: `/api/lists/[listId]`

#### Response:

```json
{
  "message": "List and its tasks deleted successfully"
}
```
### 4. Create a New Task

**Endpoint**: `POST /api/tasks`

**Description**: Creates a new task within a specified list.

#### Request:

- **Method**: `POST`
- **URL**: `/api/tasks`

#### Body:

```json
{
  "listId": "list-id",
  "title": "New Task",
  "description": "Task description"
}
```
listId: The ID of the list to which the task belongs (string).

title: The title of the new task (string).

description: The description of the new task (string).

### Response:
```json
{
  "message": "Task created successfully",
  "data": {
    "id": "new-task-id",
    "title": "New Task",
    "description": "Task description",
    "list_id": "list-id",
    "created_at": "2023-05-01T00:00:00.000Z"
  }
}
```
id: The unique identifier for the newly created task (string).

title: The title of the task.

description: The description of the task.

list_id: The ID of the list to which this task belongs.

created_at: The timestamp when the task was created.

### 5. Update a Task

**Endpoint**: `PATCH /api/tasks/[taskId]`

**Description**: Updates the title and/or description of an existing task.

#### Request:

- **Method**: `PATCH`
- **URL**: `/api/tasks/[taskId]`

#### Body:

```json
{
  "title": "Updated Task Title",
  "description": "Updated Task Description"
}
```
title: The updated title of the task (string). This is optional.

description: The updated description of the task (string). This is optional.

### Response:
```json
{
  "message": "Task updated successfully",
  "task": {
    "id": "task-id",
    "title": "Updated Task Title",
    "description": "Updated Task Description",
    "list_id": "list-id",
    "created_at": "2023-05-01T00:00:00.000Z"
  }
}
```
id: The ID of the task that was updated.

title: The updated title of the task.

description: The updated description of the task.

list_id: The ID of the list the task belongs to.

created_at: The timestamp of when the task was originally created

### 6. Delete a Task

**Endpoint**: `DELETE /api/tasks/[taskId]`

**Description**: Deletes a specific task.

#### Request:

- **Method**: `DELETE`
- **URL**: `/api/tasks/[taskId]`

#### Response:

```json
{
  "message": "Task deleted successfully"
}
```

### Clone the repository

```bash
git clone https://github.com/your-username/task-management-app.git
cd task-management-app 
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# trello

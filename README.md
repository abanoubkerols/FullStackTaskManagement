# Task Manager - MERN Stack

A simple, full-stack task management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

### Core Features (All Implemented)
- ✅ User registration and login
- ✅ JWT-based authentication with protected API endpoints
- ✅ Users can only access their own tasks
- ✅ Create, Read, Update, Delete (CRUD) tasks
- ✅ Task fields: title, description, status, priority, due date
- ✅ Statuses: To Do, In Progress, Done
- ✅ Priorities: Low, Medium, High
- ✅ Search tasks by title
- ✅ Filter tasks by status and priority
- ✅ Responsive UI (desktop + mobile)
- ✅ Loading, error, empty-state, and validation feedback

### Bonus Features
- ✅ Drag and Drop 

### AI Assistance

GitHub Copilot was used as a coding assistant during development. All AI-generated suggestions were reviewed, understood, and adapted before being integrated into the project.


### Tech Stack
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, express-validator
- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, Context API

## Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection
│   │   ├── controllers/     # Auth & Task controllers
│   │   ├── middleware/      # JWT auth middleware
│   │   ├── models/          # User & Task schemas
│   │   ├── routes/          # API routes
│   │   └── utils/           # Error handler
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth Context
│   │   ├── pages/           # Login, Register, Dashboard
│   │   ├── services/        # Axios API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── ...
└── README.md
```

## Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd task-manager
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env and set your MONGODB_URI and JWT_SECRET
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

> The Vite proxy is configured so `/api` requests go to the backend automatically.

### Environment Variables (Backend)

| Variable     | Description                          | Example                                      |
|--------------|--------------------------------------|----------------------------------------------|
| PORT         | Server port                          | 5000                                         |
| MONGODB_URI  | MongoDB connection string           | mongodb://localhost:27017/taskmanager        |
| JWT_SECRET   | Secret key for signing JWTs          | a_long_random_string                         |
| JWT_EXPIRE   | Token expiration                     | 7d                                           |
| NODE_ENV     | Environment                          | development                                  |

## API Endpoints

### Auth
| Method | Endpoint            | Access  | Description              |
|--------|---------------------|---------|--------------------------|
| POST   | /api/auth/register  | Public  | Register a new user      |
| POST   | /api/auth/login     | Public  | Login and get JWT        |
| GET    | /api/auth/me        | Private | Get current user         |

### Tasks
| Method | Endpoint            | Access  | Description                          |
|--------|---------------------|---------|--------------------------------------|
| GET    | /api/tasks          | Private | List tasks (supports search, status, priority query params) |
| GET    | /api/tasks/:id      | Private | Get single task                      |
| POST   | /api/tasks          | Private | Create task                          |
| PUT    | /api/tasks/:id      | Private | Update task                          |
| DELETE | /api/tasks/:id      | Private | Delete task                          |

**Query params for GET /api/tasks:**
- `search` – search in title (case-insensitive)
- `status` – filter by status
- `priority` – filter by priority

## Test Account

You can register a new account from the UI, or use any email/password after registering.


## Libraries & Tools Used

- **Backend**: express, mongoose, jsonwebtoken, bcryptjs, express-validator, cors, dotenv, nodemon
- **Frontend**: react, react-router-dom, axios, tailwindcss, vite
- AI tools were used to help structure and write parts of the code. All code has been reviewed and understood.

## Actual Time Spent

~ 24 hours



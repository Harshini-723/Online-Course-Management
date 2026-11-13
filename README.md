# LearnHub — Online Course Management System

A full-stack MERN starter with a professional React dashboard, Express REST API, MongoDB database, JWT authentication, and role-based access.

## Features
- Student, instructor, and admin roles
- Register/login with hashed passwords and JWT
- Browse/search courses and view course details
- Instructor course creation, editing, and deletion
- Student enrollment and learning dashboard
- Course lessons and lesson completion tracking
- Admin overview of users and courses
- Responsive layout for desktop and mobile

## Requirements
- Node.js 20+
- MongoDB local installation OR a MongoDB Atlas connection string

## 1. Configure the backend
Open a terminal in `server`:

```bash
cd server
npm install
```

Copy `.env.example` to `.env`, then set:
- `MONGO_URI` to your MongoDB connection string
- `JWT_SECRET` to a long random secret
- `CLIENT_URL=http://localhost:5173`

Start the API:

```bash
npm run dev
```

API runs at `http://localhost:5000`.

## 2. Configure the frontend
Open a second terminal in `client`:

```bash
cd client
npm install
```

Copy `.env.example` to `.env` (defaults work for local development), then:

```bash
npm run dev
```

Open `http://localhost:5173`.

## First use
1. Register an account.
2. To make an instructor or admin, update the user's `role` field in MongoDB Compass (collection `users`) to `instructor` or `admin`. Public registration intentionally creates students only.
3. Log in again. Instructors can create courses and lessons. Students can enroll and track lesson completion.

## MongoDB Atlas quick setup
1. Create a free cluster at https://www.mongodb.com/atlas.
2. Create a database user and allow your current IP address in Network Access.
3. Copy the Node.js connection string and replace `<password>`.
4. Put it in `server/.env` as `MONGO_URI`.

## Project structure
```text
online-course-management-system/
├── client/              React + Vite frontend
└── server/              Express + MongoDB API
```

## Important production notes
This is a learning/deployment-ready starter, not a fully audited commercial LMS. Before public production use, add email verification, password reset, rate limiting, audit logging, payment-provider integration if needed, object storage for video uploads, backups, and HTTPS. Never commit `.env` files.

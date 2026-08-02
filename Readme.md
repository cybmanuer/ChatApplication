# 💬 ChatApplication | V1 | Basic Chat App

A full-stack real-time chat application built with the MERN stack, Socket.IO, and Cloudinary.

## Features

- 🔐 User Authentication (JWT)
- 💬 Real-time messaging with Socket.IO
- 🟢 Online/Offline user status
- 🖼️ Image upload support via Cloudinary
- ⚡ Fast React + Vite frontend
- 🎨 Tailwind CSS + DaisyUI + Ant Design UI
- 🍪 Secure authentication using HTTP cookies
- 📱 Responsive interface

---

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Zustand
- Tailwind CSS
- DaisyUI
- Ant Design
- Socket.IO Client

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT Authentication
- Cloudinary
- bcryptjs

---

## Project Structure

```
ChatApplication
│
├── backend
│   ├── src
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
└── package.json
```

---

## Prerequisites

Install:

- Node.js (v20 or later recommended)
- npm
- MongoDB (Local or MongoDB Atlas)
- Cloudinary account

---

## Installation

Clone the repository

```bash
git clone https://github.com/cybmanuer/ChatApplication.git

cd ChatApplication
```

Install dependencies

```bash
npm run build
```

or manually

```bash
cd backend
npm install

cd ../frontend
npm install
```

---

## Environment Variables

Create a file named:

```
backend/.env
```

Copy the contents from `.env.example` and replace the placeholder values.

---

## Running the Project

### Start Backend

```bash
cd backend

npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

### Start Frontend

Open another terminal

```bash
cd frontend

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## Build for Production

```bash
npm run build
```

---

## Production

Start the backend

```bash
npm start
```

---

## Scripts

### Root

```bash
npm run build
npm start
```

### Backend

```bash
npm run dev
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

---

## Dependencies

### Backend

- Express
- Mongoose
- Socket.IO
- JWT
- bcryptjs
- Cloudinary
- Cookie Parser
- CORS
- Dotenv

### Frontend

- React
- Vite
- Zustand
- Axios
- Socket.IO Client
- Tailwind CSS
- DaisyUI
- Ant Design

---

## Deployment

The project can be deployed using:

- Render
- Railway
- Vercel (Frontend)
- MongoDB Atlas
- Cloudinary
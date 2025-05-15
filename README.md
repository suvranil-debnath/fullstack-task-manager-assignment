# 📝 Full Stack ToDo App

A full-featured ToDo list application with authentication and theme support — powered by a **Node.js + MongoDB Atlas backend** and a **Vite + React + TailwindCSS frontend**.

🌐 **Live Demo**: https://whattodonext24.netlify.app/

---
Server Deployed at Render (https://fullstack-task-manager-assignment.onrender.com)
---

## 🚀 Tech Stack

### 🔧 Backend
- **Node.js** with **Express.js**
- **MongoDB Atlas** (cloud-hosted NoSQL database)
- **Mongoose** – for MongoDB object modeling
- **bcryptjs** – for password encryption
- **Nodemon** – for development
- ES Modules (`"type": "module"` in `package.json`)

### 🎨 Frontend
- **React** with **Vite**
- **TailwindCSS** – for utility-first styling
- **Axios** – for API communication
- **React Router DOM** – for client-side routing

---

## 📦 Features

### ✅ Core Functionality
- User **registration** and **login** with `username` and `password`
- Secure **password encryption** using `bcryptjs`
- **CRUD** operations for ToDo tasks (Create, Read, Mark, Delete)
- User-specific ToDo list (only logged-in user's tasks shown)

### 🎨 UI/UX
- Responsive and minimalist UI with TailwindCSS
- Icon-based **theme switcher** (🌞 Light / 🌙 Dark / 🖥️ System)
- **Theme persistence** using localStorage

---

## 🎁 Bonus Features
- **Modular file structure** for scalability
- Clean and commented codebase
- Seamless developer experience with **Vite** and **Nodemon**
- Visual error handling and basic input validation

---

## 🛠️ Local Setup 
### Backend
    cd server
    npm install
    Create a .env file in the backend/ directory and add the following:
        -PORT = 5000
        -DB  = "your_mongodb_atlas_connection_string"
    npm run dev
### Frontend
    cd toodolist
    npm install
    npm run dev
### 📁  Repository
https://github.com/suvranil-debnath/fullstack-task-manager-assignment

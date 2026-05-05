# 🚀 Team Task Manager (Full-Stack)

A full-stack web application that allows teams to manage projects, assign tasks, and track progress with **role-based access (Admin & Member)**.

---

## 🌐 Live Demo

- 🔗 Frontend: https://your-frontend.vercel.app
- 🔗 Backend API: https://task-manager-production-b480.up.railway.app

---

## 📌 Features

### 🔐 Authentication

- User Signup & Login (JWT-based)
- Role-based access (Admin / Member)
- Admin approval required for member login

### 👑 Admin Capabilities

- Create & manage projects
- Add / remove (deactivate) members
- Assign tasks to members
- Edit & delete tasks
- View submitted tasks (link/file)
- Dashboard with task statistics

### 👤 Member Capabilities

- View assigned tasks
- Submit tasks (via link or file upload)
- Track task status (Todo / Done)

---

## 🏗️ Tech Stack

### Frontend

- React.js
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer (file uploads)

### Deployment

- Backend → Railway
- Frontend → Vercel
- Database → MongoDB Atlas

---

## 📂 Folder Structure

```
task-manager/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
PORT=5000
```

Run server:

```
npm start
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm start
```

---

## 🔑 Default Admin Setup

Admin is created manually in database.

Example:

```
email: admin@gmail.com
password: admin123
role: Admin
isApproved: true
```

---

## 📊 API Endpoints

### Auth

- POST `/api/auth/signup`
- POST `/api/auth/login`
- GET `/api/auth/approved`

### Projects

- POST `/api/projects`
- GET `/api/projects`
- POST `/api/projects/:id/add-member`
- PUT `/api/projects/:id/remove-member`
- GET `/api/projects/:id/members`

### Tasks

- POST `/api/tasks`
- GET `/api/tasks/project/:projectId`
- GET `/api/tasks/user/:userId`
- PUT `/api/tasks/:id/status`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`

---

## 📸 Screenshots

_(Add screenshots here for better presentation)_

---

## 🎥 Demo Video

## https://drive.google.com/file/d/10T5ji6ud1COWaGF5StOrB8Xx7Q8cx1Pm/view?usp=sharing

## 🚀 Deployment

### Backend (Railway)

- Connect GitHub repo
- Set root directory → `backend`
- Add environment variables

### Frontend (Vercel)

- Import repo
- Set root directory → `frontend`

---

## 🧠 Future Improvements

- 📊 Dashboard analytics (charts)
- 🔔 Notifications system
- 📅 Task deadlines with alerts
- 🌙 Dark mode UI

---

## 👨‍💻 Author

**Nagineni Nithin Rao**

- 💼 Aspiring Software Developer
- 🔗 GitHub: https://github.com/nagineninithinrao

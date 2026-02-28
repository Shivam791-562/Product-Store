# Full-Stack Product Store

A production-ready full-stack application featuring a modern React frontend and a Node/Express backend. Built with performance and scalability in mind, including server-side pagination, debounced searching, global state management, and an interactive analytics dashboard.

## 🔗 Live Demo
[View Deployed Project](https://product-store-qpfv.onrender.com)

## ✨ Key Features
- **Advanced Data Handling:** Server-side pagination (`LIMIT` / `OFFSET`) and dynamic SQL filtering (`ILIKE`).
- **Optimized Frontend:** Debounced search inputs and skeleton loading states to ensure fast Core Web Vitals.
- **Interactive Analytics:** Real-time data visualization dashboard built with Recharts.
- **State Management:** Efficient global state handling using Zustand with Optimistic UI updates.
- **Security:** Integrated Arcjet for rate-limiting and bot protection.
- **Dynamic Theming:** Custom DaisyUI theme selector built from scratch.

## 🛠️ Tech Stack
- **Frontend:** React, Vite, TailwindCSS, DaisyUI, Zustand, Recharts, Lucide React
- **Backend:** Node.js, Express, PostgreSQL (Neon DB)
- **Security & Deployment:** Arcjet, Render

---

## 🚀 Local Setup & Installation

### 1. Initialize and Install Dependencies
From the root directory, install both backend and frontend modules:

```bash
npm install
npm install --prefix frontend
```

### 2. Setup Environment Variables
Create a .env file inside the backend folder and add your credentials:

```env
PORT=3000
PGUSER=your_pg_user
PGPASSWORD=your_pg_password
PGHOST=your_pg_host
PGDATABASE="neondb"
NODE_ENV=development
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
```

### 3. Run the Development Servers
You will need two terminals to run the app locally.

Terminal 1 (Backend):

```bash
npm start
```

Terminal 2 (Frontend):

```bash
cd frontend
npm start
```
# Team Task Manager – Full-Stack

**Author:** Amir Hussain

---

## 🚀 What this is
A small full-stack web app where teams can create projects, assign tasks, and track progress with simple role-based access (Admin / Member).

Built for a 1–2 day assignment with focus on:
- Clean flows  
- Clear roles  
- Working deployed app  

---

## 🔗 Live Links
- **Live App:** [<LIVE_APP_URL>  ](https://team-task-manager-liard-phi.vercel.app/) || Some Issue with the Backend I will fix it Later
- **GitHub Repo:** [<GITHUB_REPO_URL>](https://github.com/123-Amir/team-task-manager)  
- **Demo Video (2–5 min):** [<VIDEO_URL>](https://www.loom.com/share/7d5de52f46ef425d96d75cca08242ed8)  

---

## ✨ Main Features
- 🔐 Signup / Login (JWT, hashed passwords)  
- 📁 Projects: create, view, manage members (Admin / Member)  
- 📝 Tasks: create, assign, update status (TODO → IN_PROGRESS → DONE)  
- 📊 Dashboard: total tasks, status-wise breakdown, overdue tasks  
- 🔑 Role-based access:
  - Only Admins can manage members  
  - Only authorized users can update tasks  

---

## 🛠 Tech Stack
- **Frontend:** React + Vite, React Router, Axios  
- **Backend:** Node.js + Express, JWT, bcrypt  
- **Database:** Prisma ORM  
  - SQLite (local development)  
  - PostgreSQL (production – Railway)  
- **Deployment:** Railway  

---

## ⚙️ How to Run Locally

### Backend (Server)

npm install

Create .env file:

DATABASE_URL="file:./dev.db"
JWT_SECRET="some-secret"
PORT=5000
npx prisma migrate dev --name init
npm start
Frontend (Client)
npm install

Create .env file:

VITE_API_URL="http://localhost:5000"
npm run dev

🤖 How I Used AI

Used tools like Perplexity for:

Breaking down requirements
Setting up the stack
Generating boilerplate (routes, components, Prisma schema)

I designed the data model, roles, and application flow, integrated all components, and handled debugging independently.

📌 Notes
This project demonstrates full-stack development skills
Focus on clean architecture and role-based access control

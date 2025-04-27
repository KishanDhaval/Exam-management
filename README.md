# Exam Management Web Application

A full-stack online examination system built with the MERN stack. Teachers can create exams (with questions), students can take them during the active window, and both can view results. Role-based authentication ensures students and teachers only access their own dashboards.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Environment Variables](#environment-variables)  
  - [Running the App](#running-the-app)  
---

## Features

- **Role‐based Authentication** (student / teacher / admin)  
- **Teacher Dashboard**  
  - Create, update, delete exams  
  - Add, update, delete questions in bulk  
  - View submissions and statistics  
- **Student Dashboard**  
  - List currently active exams (by start/end date)  
  - Start and submit exams  
  - View past results and detailed scores  
- **Secure APIs** with JWT + middleware (`protect`, `authorize`)  
- **Zustand** store for frontend state (auth + exam/result data)  
- **Tailwind CSS** + **Lucide Icons** for styling  

---

## Tech Stack

- **Frontend:** React, Tailwind CSS  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens  
- **Dev Tools:** VSCode, Nodemon, Postman  

---

## Getting Started

### Prerequisites

- **Node.js** v14+  
- **npm** or **yarn**  
- **MongoDB** (local or Atlas cluster)  

### Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/exam-management.git
   cd exam-management
   ```
2. **Backend Setup**
   ```base
   cd server
   npm install
   cp .env.example .env
   ```
3. **Frontend Setup**
   ```base
   cd client
   npm install
   ```
4. **environment-variables**
   ```base
   MONGO_URI=mongodb://localhost:27017/examdb
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```
5. **running-the-app**
   ```base
    cd server
    npx nodemon
    cd client
    npm run dev
   ```
![Image](https://github.com/user-attachments/assets/9da3ecd6-5e3a-47ab-a4e0-48cac0f74ab0)
![Image](https://github.com/user-attachments/assets/cb81ca6b-5512-4fc3-bff3-299526421dcd)
![Image](https://github.com/user-attachments/assets/4b3c6674-bc9c-4602-97ea-46ed7cffcc69)
![Image](https://github.com/user-attachments/assets/cdda3491-a480-49a0-8c24-df8509406fcd)
![Image](https://github.com/user-attachments/assets/1a3f58f8-0563-4578-9aaf-ff29e3c8edac)
![Image](https://github.com/user-attachments/assets/138d4327-f2ff-4d00-a8c9-358e472f7b78)
![Image](https://github.com/user-attachments/assets/7bdbfd2d-3eb4-4657-8785-62c69e3cdb28)

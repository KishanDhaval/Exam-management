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

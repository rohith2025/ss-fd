# 🎨 ShikshaSetu – Frontend  
### React + Vite

![React](https://img.shields.io/badge/React-Frontend-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-purple?logo=vite)
![Tailwind](https://img.shields.io/badge/TailwindCSS-Styling-38B2AC?logo=tailwindcss)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 📌 Overview

ShikshaSetu Frontend provides the **user interface** for the ShikshaSetu academic management platform.

It focuses on **clean UI**, **role-based dashboards**, and **seamless interaction** with backend REST APIs.

---

## 🛠 Tech Stack

- ⚛️ **React.js** – UI library  
- ⚡ **Vite** – Fast development build tool  
- 🎨 **Tailwind CSS** – Utility-first styling  
- 🧭 **React Router DOM** – Client-side routing  
- 🔗 **Axios** – API communication  

---

## ✨ Features

- 🔐 Role-based dashboards  
- 🛡 Protected routing  
- 📱 Responsive layouts  
- 🧼 Clean and minimal UI  
- 🔁 Centralized API communication  

---

## 👥 Role-Based UI

### 🎓 Student
- View timetable
- View exams and grades
- Apply for leave

### 👨‍👩‍👧 Parent
- View student academic information
- Approve or reject leave requests

### 👨‍🏫 Teacher
- View assigned timetable
- Update student grades

### 🧑‍💼 HOD
- Upload and manage timetables
- Approve leave requests

### 🛠 Admin
- User and system management

---

## 🧭 Routing Strategy

- 🌐 Public routes for authentication  
- 🔒 Protected routes for dashboards  
- 🎯 Route access controlled based on user role  

---

## 🔗 Backend Integration

- REST APIs consumed using **Axios**
- JWT token attached to authenticated requests
- Error handling managed at UI level

---

## ▶️ Running the Frontend

```bash
npm install
npm run dev

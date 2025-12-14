# 🍬 Sweet Shop Management System

A complete full-stack Sweet Shop Management System developed using React (Vite) for the frontend and Spring Boot (Java) for the backend.
The system implements JWT-based authentication, role-based authorization (Admin/User), and centralized inventory management using MongoDB Atlas..

---

## 📌 Project Overview

The Sweet Shop Management System is designed to digitize and simplify sweet shop operations.  
It provides separate interfaces for *customers (users)* and *administrators*, ensuring secure access and efficient management.

### 👤 User Capabilities
- Register and login securely
- View available sweets
- Search and filter sweets
- Purchase sweets (disabled automatically if out of stock)

### 🛠️ Admin Capabilities
- Secure admin login
- Add new sweets
- Update and delete sweets
- Manage inventory effectively

The system follows *clean architecture principles* and simulates a *real-world production-ready application*.

---

## 🧱 Tech Stack

### Frontend
- React.js (Vite)
- JavaScript (ES6+)
- Axios
- JWT Authentication
- React Router DOM

### Backend
- Java
- Spring Boot
- Spring Security
- JWT (JSON Web Token)
- MongoDB (MongoDB Atlas)

---

## 🏗️ Architecture

### Backend (Spring Boot)
- *Controller Layer* – Handles API requests
- *Service Layer* – Business logic
- *Repository Layer* – Database access
- *Security Layer* – JWT filters, authentication & authorization

### Frontend (React)
- Component-based architecture
- Context API for authentication
- Role-based routing and navigation
- Auto-switching navbar (Public / User / Admin)

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Single login & registration page
- Backend determines user role (Admin/User)
- Frontend redirects users automatically based on role
- Secured admin-only and user-only routes

---

## 🤖 AI Usage

### AI Tools Used
- *ChatGPT (OpenAI)*
- *Claude (Anthropic)*

### How AI Was Used

*ChatGPT assisted in:*

 -Designing system workflows and features

 -Structuring backend JWT authentication

 -Creating REST API architecture

 -Improving code quality and best practices

 -Drafting professional documentation

*Claude assisted in:*

 -Debugging frontend-backend integration issues

 -Resolving runtime and logical errors

 -Analyzing error logs and suggesting fixes
---

# ⚙️ Backend Installation & Setup Guide  
(Spring Boot + MongoDB Atlas + JWT)

This guide explains how to set up and run the *backend service* of the Sweet Shop Management System on a local machine.

---

## 📋 Prerequisites

Before starting, make sure the following are installed:

- *Java JDK 17 or above*
- *Maven*
- *MongoDB*
- *MongoDB Atlas
- *IntelliJ IDEA / Eclipse / VS Code*

Check versions:
```bash
java -version
mvn -version
  ```  
## 📂 Clone the Repository
```bash
git clone https://github.com/Mr-coder14/Sweet-Shop-Management.git
cd SweetShop/SweetShop Backend
```

## ⚙️ Configure Application Properties
Open the file: src/main/resources/application.properties
Add or update the following: 
```bash
spring.data.mongodb.uri=mongodb://localhost:27017/sweetshop
spring.data.mongodb.database=sweetshop

jwt.secret=MyVerySecureSweetShopSecretKeyThatIsAtLeast32CharactersLong!@#$%
jwt.expiration=86400000

server.port=8081
```
## 🗄️ Start MongoDB - Using MongoDB Atlas

Open MongoDB Atlas
Connect to: mongodb+srv://mukilan895_db_user:<db_password>@sweet.dxfjw1o.mongodb.net/?appName=Sweet
The database sweetshop will be created automatically when the app runs

## ▶️ Run the Spring Boot Application
Using Maven (Recommended)
mvn spring-boot:run

## 🌐 Backend Server Details
Once started successfully, the backend will be available at: http://localhost:8081

# 🌐 Frontend Installation & Setup Guide  
(React.js + Vite + JWT)

This guide explains how to set up and run the *frontend application* of the Sweet Shop Management System on a local machine.

---

## 📋 Prerequisites

Before starting, make sure the following are installed:

- *Node.js (v18 or above recommended)*
- *npm* or *yarn*
- A modern web browser (Chrome, Edge, Firefox)
- Code editor (VS Code recommended)

Check versions:
```bash
node -v
npm -v
```
## 📂 Clone the Repository
```bash
git clone https://github.com/shyam-n-hub/sweet_shop.git
cd SweetShop/sweetShop Frontend
```
## 📦 Install Dependencies
Install all required packages:
npm install
This will install React, Vite, Axios, React Router DOM, and other dependencies.

## ▶️ Run the Frontend Application
Start the development server:
npm run dev

## 🌐 Frontend Server Details
Once started successfully, the application will be available at:
http://localhost:5173

## 🔑 Demo Admin Credentials

Use the following credentials to log in as an *Admin* for testing and evaluation purposes:

- *Email:* admin@gmail.com
- *Password:* password1234

## 📸 Output Screenshots

Below are screenshots of the Sweet Shop Management System in action.

### 🏠 Home Page
<img width="1918" height="870" alt="home" src="https://github.com/user-attachments/assets/cf871339-203c-4fb5-9315-13687eee48fc" />

### 🔐 Login Page
<img width="1918" height="863" alt="login" src="https://github.com/user-attachments/assets/1172f904-b799-43ad-8aa8-4f7d6a485d8b" />

### 📝 Register Page
<img width="1918" height="857" alt="register" src="https://github.com/user-attachments/assets/20da9cdc-1bea-46ce-aee9-754a84658e38" />

### 👤 User Dashboard
<img width="1918" height="867" alt="all sweets" src="https://github.com/user-attachments/assets/43480ae4-d205-4a6c-a26d-44f5035f1a86" />

### 🛠️ Admin Dashboard
<img width="1917" height="867" alt="admin home" src="https://github.com/user-attachments/assets/d971bcca-2e15-41be-a4f7-4471f1b3a82a" />

### 🍬 Manage Sweets (Admin)
<img width="1918" height="872" alt="manage sweet 3" src="https://github.com/user-attachments/assets/af097c5c-9ee5-4bb6-af17-e63769e9422e" />



## ✅ Conclusion

This Sweet Shop Management System demonstrates a production-style full-stack application with secure authentication, role-based authorization, and cloud database integration.

By combining React (Vite), Spring Boot, JWT Security, and MongoDB Atlas, the project reflects real-world application development practices.

The system showcases strong skills in:

Full-stack development

Secure API design

Authentication & authorization

Database integration

Clean and maintainable code structure

This project serves as a solid portfolio application suitable for Full Stack Developer, Java Developer, and React Developer roles.

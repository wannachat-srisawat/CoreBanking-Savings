# 💰 Saving Account - Core Banking Demo

This is a full-stack web application simulating a **saving account module** for a core banking system.  
Users are separated into roles: **TELLER** and **CUSTOMER**, with strict role-based access control and JWT authentication.

## 🔧 Tech Stack

- 🟦 **Backend**: Java 21, Spring Boot, Maven, JWT, Spring Security
- 🟨 **Frontend**: Angular 16, Bootstrap 5, Typescript
- 🐘 **Database**: PostgreSQL
- 🐳 **DevOps**: Docker Compose (Single command to start full stack)

---

## 📦 Features

### 👨‍💼 TELLER

- ✅ Open account for customers using citizen ID
- ✅ Deposit into any account
- ✅ View dashboard menu (based on role)

### 🙋‍♂️ CUSTOMER

- ✅ Register with citizen ID and role
- ✅ Withdraw with PIN (validated securely)
- ✅ Transfer to another account
- ✅ View monthly statement
- ✅ View current account and balance

### 🔒 Security

- ✅ Role-based access via Spring Security (`@PreAuthorize`)
- ✅ JWT authentication (token stored in localStorage)
- ✅ Password & PIN encrypted with BCrypt

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/saving-account-corebanking.git
cd saving-account-corebanking
```
### 2. Start the app

```bash
docker compose up --build
```
```bash
App will be available at:

Frontend: http://localhost:4200

Backend: http://localhost:8080

Swagger UI: http://localhost:8080/swagger-ui/index.html
```

📌 Author
Developed by Fluke - Wannachat Srisawat

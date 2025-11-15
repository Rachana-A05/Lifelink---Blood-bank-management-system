# 🩸 LifeLink - Blood Bank Management System

A comprehensive full-stack web application for managing blood bank operations across multiple hospitals, built with React, Node.js, Express, and MySQL.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Contributors](#contributors)

---

## 🎯 Overview

LifeLink is a blood bank management system designed to streamline blood donation, inventory management, patient requests, and billing processes. The system enables hospitals to efficiently manage blood stock, track donations, handle patient requests, and maintain comprehensive logs of all transactions.

This project was developed as part of the **Database Management System (UE23CS351A)** course at **PES University**.

---

## ✨ Features

### Core Functionalities
- **Hospital Management**: Register and manage multiple hospital locations
- **Donor Management**: Track donor information, donation history, and eligibility
- **Patient Management**: Maintain patient records and blood group information
- **Blood Stock Inventory**: Real-time tracking of blood units by type, expiry date, and location
- **Blood Request System**: Submit, approve, and fulfill blood requests
- **Stock Distribution**: Allocate blood units to patients with automatic inventory updates
- **Billing System**: Automated billing with customized pricing per blood group
- **System Logs**: Comprehensive audit trails for donations, billing, and stock changes

### Advanced Features
- **Automated Alerts**: Low stock and expiry date notifications
- **Triggers**: Automatic stock decrement, billing creation, and alert generation
- **Stored Procedures**: Complex business logic for approvals, rejections, and report generation
- **Functions**: Reusable calculations for eligibility, pricing, and statistics
- **Dashboard**: Real-time analytics and visual insights
- **CRUD Operations**: Full create, read, update, delete on all entities

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Bootstrap** - Responsive design
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver

### Database
- **MySQL** - Relational database
- **Triggers, Procedures, Functions** - Advanced SQL logic

### Development Tools
- **VS Code** - Code editor
- **Git & GitHub** - Version control
- **Postman** - API testing
- **MySQL Workbench** - Database management

---

## 📁 Project Structure

```
LifeLink/
├── backend/
│ ├── routes/
│ │ ├── billing.js
│ │ ├── dashboard.js
│ │ ├── distribution.js
│ │ ├── donors.js
│ │ ├── hospitals.js
│ │ ├── labtests.js
│ │ ├── logs.js
│ │ ├── patients.js
│ │ ├── requests.js
│ │ └── stock.js
│ ├── db.js # Database connection
│ ├── server.js # Express server
│ ├── package.json
│ └── package-lock.json
│
├── frontend/
│ ├── public/
│ │ └── index.html
│ ├── src/
│ │ ├── components/
│ │ │ ├── Billing.js
│ │ │ ├── Dashboard.js
│ │ │ ├── Donors.js
│ │ │ ├── Hospitals.js
│ │ │ ├── LabTests.js
│ │ │ ├── Landing.js
│ │ │ ├── Logs.js
│ │ │ ├── Navbar.js
│ │ │ ├── Patients.js
│ │ │ ├── Requests.js
│ │ │ ├── Stock.js
│ │ │ └── StockDistribution.js
│ │ ├── services/
│ │ │ └── api.js # Axios configuration
│ │ ├── styles/
│ │ │ └── app.css
│ │ ├── App.js
│ │ └── index.js
│ ├── package.json
│ ├── package-lock.json
│ └── .gitignore.txt
│
├── database/
│ ├── schema.sql # DDL commands
│ ├── triggers.sql # All triggers
│ ├── procedures.sql # Stored procedures
│ ├── functions.sql # User-defined functions
│ ├── sample_data.sql # Test data
│ └── test.sql # Test queries
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Clone Repository
```
git clone https://github.com/Rachana-A05/Lifelink---Blood-bank-management-system.git
cd Lifelink---Blood-bank-management-system
```

### Install Backend Dependencies
```
cd backend
npm install
```
### Install Frontend Dependencies
```
cd frontend
npm install
```

---

## 🗄️ Database Setup

### Step 1: Create Database
```
mysql -u root -p
CREATE DATABASE bloodbank;
USE bloodbank;
```

### Step 2: Run Schema
```
mysql -u root -p bloodbank < database/schema.sql
```

### Step 3: Load Sample Data (Optional)
```
mysql -u root -p bloodbank < database/sample_data.sql
```

### Step 4: Create Triggers, Procedures, Functions
```
mysql -u root -p bloodbank < database/triggers.sql
mysql -u root -p bloodbank < database/procedures.sql
mysql -u root -p bloodbank < database/functions.sql
```

### Step 5: Configure Database Connection
Edit `backend/db.js`:
```
const pool = mysql.createPool({
host: 'localhost',
user: 'root',
password: 'your_password',
database: 'bloodbank',
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0
});
```
## ▶️ Running the Application
### Start Backend Server
```
cd backend
npm start
```
Server runs on: `http://localhost:4000`

### Start Frontend Development Server
```
cd frontend
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🔌 API Endpoints

### Hospitals
- `GET /api/hospitals` - Get all hospitals
- `POST /api/hospitals` - Add new hospital
- `PUT /api/hospitals/:id` - Update hospital
- `DELETE /api/hospitals/:id` - Delete hospital

### Donors
- `GET /api/donors` - Get all donors
- `POST /api/donors` - Add new donor
- `PUT /api/donors/:id` - Update donor
- `DELETE /api/donors/:id` - Delete donor

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Add new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Blood Stock
- `GET /api/stock` - Get all stock
- `POST /api/stock` - Add stock
- `PUT /api/stock/:id` - Update stock
- `DELETE /api/stock/:id` - Delete stock

### Blood Requests
- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create request
- `PUT /api/requests/:id/approve` - Approve request
- `PUT /api/requests/:id/reject` - Reject request

### Billing
- `GET /api/billing` - Get all bills
- `POST /api/billing` - Create bill
- `PUT /api/billing/:id` - Update bill
- `DELETE /api/billing/:id` - Delete bill

### Stock Distribution
- `GET /api/distribution/patient/:id` - Get patient request
- `GET /api/distribution/stock/:blood_group` - Get matching stock
- `POST /api/distribution` - Distribute blood

### System Logs
- `GET /api/logs/billing_logs` - Billing logs
- `GET /api/logs/donation_logs` - Donation logs
- `GET /api/logs/stock_alerts` - Stock alerts

---

## 📊 Database Schema

### Key Tables
- **hospitals** - Hospital information
- **donors** - Donor details and blood groups
- **patients** - Patient records
- **blood_stock** - Blood inventory
- **donation_history** - Donation records
- **blood_requests** - Patient blood requests
- **billing** - Payment records
- **stock_alerts** - Low stock notifications
- **billing_logs** - Audit trail for billing
- **donation_logs** - Audit trail for donations

### Key Relationships
- `patients.hospital_id` → `hospitals.hospital_id`
- `blood_stock.hospital_id` → `hospitals.hospital_id`
- `donation_history.donor_id` → `donors.donor_id`
- `blood_requests.patient_id` → `patients.patient_id`
- `billing.request_id` → `blood_requests.request_id`

---

## 👥 Contributors

**Team Members:**
- **Rachana A** - Full-stack Development, Database Design
- **Priyanka M P** - Database Queries

**Course:** Database Management System (UE23CS351A)  
**Institution:** PES University  
**Academic Year:** 2024-2025

---

## 📝 License

This project is developed for academic purposes as part of the DBMS course at PES University.

---

## 🙏 Acknowledgments

- PES University Faculty for guidance
- Course Instructor for project requirements
- Open-source community for tools and libraries

---

## 📞 Contact

For queries or contributions:
- GitHub: [@Rachana-A05](https://github.com/Rachana-A05)
- Repository: [LifeLink Blood Bank System](https://github.com/Rachana-A05/LifeLink-Blood_bank_management_system-)

---

**Made with ❤️ for better healthcare**



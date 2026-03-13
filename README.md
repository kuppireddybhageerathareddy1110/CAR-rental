# 🚗 Car Rental System

A full-stack **Car Rental Management System** built with the **MERN stack (MongoDB, Express.js, React, Node.js)**.
The platform allows users to browse available cars, make bookings, and manage rentals, while admins can manage cars, bookings, and users through an admin dashboard.

---

# 🌐 Live Demo

Frontend (Deployed on Vercel)
https://car-rental-bhm4.vercel.app/

Backend API (Deployed on Render)
https://car-rental-xdz8.onrender.com/

---

# 🧰 Tech Stack

### Frontend

* React.js
* Axios
* Zustand (state management)
* TailwindCSS / CSS
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* REST API

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

# ✨ Features

## 👤 User Features

* User registration and login
* Browse available cars
* Book cars
* View booking history
* User profile management

## 🚘 Car Features

* View car details
* Check car availability
* Book a car with selected dates

## 🛠 Admin Features

* Admin dashboard
* Manage cars (Add / Edit / Delete)
* Manage bookings
* Manage users
* View system statistics

## 🏢 Showroom Features

* Manage showroom cars
* Track maintenance
* Manage bookings from showroom

---

# 📂 Project Structure

```
CAR-rental
│
├── backend
│   ├── config
│   ├── routes
│   ├── models
│   ├── middleware
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── api
│   │   └── store
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the repository

```
git clone https://github.com/kuppireddybhageerathareddy1110/CAR-rental.git
cd CAR-rental
```

---

# Backend Setup

```
cd backend
npm install
```

Create `.env`

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
```

Run backend

```
npm start
```

---

# Frontend Setup

```
cd frontend
npm install
```

Create `.env`

```
REACT_APP_API_URL=http://localhost:5000/api
```

Run frontend

```
npm start
```

---

# 🔑 API Endpoints

## Auth

```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

## Cars

```
GET /api/cars
POST /api/cars
PUT /api/cars/:id
DELETE /api/cars/:id
```

## Bookings

```
GET /api/bookings
POST /api/bookings
```

---

# 🔐 Authentication

Authentication is handled using **JWT tokens**.

Flow:

1. User logs in
2. Server returns JWT token
3. Token stored in localStorage
4. Axios interceptor attaches token to requests

---

# 🚀 Deployment

### Frontend

Deployed using **Vercel**

### Backend

Deployed using **Render**

### Environment Variables (Production)

Frontend

```
REACT_APP_API_URL=https://car-rental-xdz8.onrender.com/api
```

Backend

```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret
CLIENT_URL=https://car-rental-bhm4.vercel.app
```

---

# 📸 Screenshots

You can add screenshots of:

* Home page
* Car listing
* Booking page
* Admin dashboard

---

# 🤝 Contributing

Pull requests are welcome.
For major changes, please open an issue first.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Bhageeratha Reddy**

GitHub:
https://github.com/kuppireddybhageerathareddy1110

# Store Rating System

A full-stack web application that allows users to submit ratings for stores registered on the platform. The system features role-based access control with three user types: System Administrator, Normal User, and Store Owner.

## 🚀 Features

### System Administrator
- View dashboard with statistics (total users, stores, and ratings)
- Add new stores, users, and admin accounts
- View and filter lists of users and stores
- Sort data by various fields (name, email, address, role)
- View detailed user information including store ratings for store owners

### Normal User
- Sign up and log in to the platform
- View all registered stores with their ratings
- Search stores by name and address
- Submit ratings (1-5 stars) for stores
- Modify existing ratings
- Update password

### Store Owner
- Log in to view their store dashboard
- View average rating of their store
- See list of users who rated their store
- Update password

## 🛠️ Tech Stack

### Frontend
- **Vite** - Fast build tool
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd store-rating-system
```

### 2. Database Setup

Open MySQL and run the following commands:

```sql
CREATE DATABASE store_rating_system;
USE store_rating_system;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  role ENUM('admin', 'user', 'store_owner') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  address VARCHAR(400),
  owner_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_store (user_id, store_id)
);
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating_system
JWT_SECRET=your_secret_key_here
```

Create admin user:

```bash
node createAdmin.js
```

Start the backend server:

```bash
npm run dev
```

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 🔐 Default Admin Credentials

```
Email: admin@example.com
Password: Admin@1
```

## 📝 Validation Rules

### User Signup
- **Name**: 8-20 characters
- **Email**: Valid email format
- **Password**: 6-12 characters with at least one uppercase letter and one special character
- **Address**: Maximum 400 characters

### Store Creation
- **Name**: 10-60 characters
- **Email**: Valid email format
- **Address**: Maximum 400 characters

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `PUT /api/auth/change-password` - Change password

### Admin Routes (Protected)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users with filters
- `GET /api/admin/stores` - Get all stores with filters
- `GET /api/admin/users/:id` - Get user details
- `POST /api/admin/user` - Add new user
- `POST /api/admin/store` - Add new store

### User Routes (Protected)
- `GET /api/user/stores` - Get all stores with ratings
- `POST /api/user/rate` - Submit or update rating

### Store Owner Routes (Protected)
- `GET /api/store/ratings` - Get all ratings for owner's store
- `GET /api/store/average` - Get average rating

## 📁 Project Structure

```
store-rating-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── userController.js
│   │   └── storeController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── user.js
│   │   └── store.js
│   ├── .env
│   ├── server.js
│   ├── createAdmin.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── PrivateRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── UserDashboard.jsx
    │   │   └── StoreOwnerDashboard.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

## 🧪 Testing the Application

### Test as Admin
1. Login with admin credentials
2. View dashboard statistics
3. Add new users and stores
4. Filter and sort user/store lists

### Test as Normal User
1. Sign up with a new account
2. View stores list
3. Search for stores
4. Submit ratings for stores
5. Modify existing ratings

### Test as Store Owner
1. Login with store owner credentials (created by admin)
2. View store's average rating
3. See list of users who rated the store

## 🔒 Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Role-based access control
- Protected API routes
- Input validation on both frontend and backend
- SQL injection prevention using parameterized queries

## 🐛 Troubleshooting

### Backend won't start
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify database and tables exist

### Frontend connection refused
- Ensure backend is running on port 5000
- Check CORS configuration

### Database errors
- Verify MySQL user has proper permissions
- Ensure all tables are created correctly

## 📄 License

This project is created for educational purposes.

## 👥 Contributing

This is a coding challenge project. For any issues or improvements, please create an issue or pull request.

## 📧 Contact

For questions or support, please contact the development team.

---

**Note**: Remember to never commit your `.env` file to version control. Add it to `.gitignore`.

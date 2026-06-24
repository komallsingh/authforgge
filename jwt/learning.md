# 📘 JWT Authentication REVISION GUIDE

---

# 🏗️ Project Structure

```text
jwt-auth/
│
├── controllers/
│   └── authCont.js
│
├── middleware/
│   └── authMidd.js
│
├── models/
│   └── User.js
│
├── routes/
│   └── authRoute.js
│
├── .env
├── package.json
├── server.js
```

---

# 🧠 Understanding Backend Architecture

A backend project is divided into responsibilities.

Instead of writing everything in one file, we separate logic.

---

# 🔄 Backend Request Flow

```text
Client Request
      │
      ▼
Routes
      │
      ▼
Controller
      │
 ┌────┴────┐
 ▼         ▼
Model     JWT
(DB)      Auth
      │
      ▼
Response Sent
```

---

# 📄 1️⃣ server.js

# 📌 Purpose

This is the main entry point of the application.

It starts the server and connects everything together.

---

# ✅ Responsibilities

- Create Express app
- Load environment variables
- Connect MongoDB
- Register routes
- Start server

---

# 🧠 Why It Is Important

Without `server.js`:

- Express server won't run
- Routes won't work
- Database won't connect

This is the "brain" of the backend.

---

# 🧱 Default Code

```js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());

const authRoutes = require('./routes/authRoute');

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log('MongoDB Connected');
})
.catch((err) => {
    console.log(err);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
```

---

# 📘 Concepts Learned

- Express Server
- Middleware
- MongoDB Connection
- Environment Variables

---

# 📄 2️⃣ .env

# 📌 Purpose

Stores secret or configurable data.

---

# ✅ Responsibilities

- Store MongoDB URL
- Store JWT Secret
- Store PORT

---

# 🧠 Why It Is Important

Never hardcode secrets inside code.

Bad:

```js
const secret = "mysecret123";
```

Good:

```js
process.env.JWT_SECRET
```

---

# 🧱 Default Code

```env
PORT=5000

MONGODB_URL=your_mongodb_connection_string

JWT_SECRET=mysecretkey123
```

---

# 📘 Concepts Learned

- Environment Variables
- Security
- Configuration Management

---

# 📄 3️⃣ models/User.js

# 📌 Purpose

Defines how user data is stored in MongoDB.

---

# ✅ Responsibilities

- Create schema
- Define fields
- Define validation rules

---

# 🧠 Why It Is Important

Without models:

- MongoDB structure becomes messy
- Data validation becomes difficult

Models make data organized.

---

# 🧱 Default Code

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("User", userSchema);
```

---

# 📘 Concepts Learned

- Mongoose
- Schema
- Database Modeling
- Validation

---

# 📄 4️⃣ routes/authRoute.js

# 📌 Purpose

Defines API endpoints.

---

# ✅ Responsibilities

Maps:

```text
URL → Controller Function
```

---

# 🧠 Why It Is Important

Routes separate API endpoints from business logic.

Without routes:

Everything becomes mixed and difficult to manage.

---

# 🧱 Default Code

```js
const express = require('express');

const router = express.Router();

const authController =
require('../controllers/authCont');

router.post(
    '/register',
    authController.register
);

router.post(
    '/login',
    authController.login
);

module.exports = router;
```

---

# 📘 Concepts Learned

- REST APIs
- Routing
- API Endpoints

---

# 📄 5️⃣ controllers/authCont.js

# 📌 Purpose

Contains business logic.

Routes receive requests.

Controllers decide what should happen.

---

# ✅ Responsibilities

- Register user
- Login user
- Hash password
- Generate JWT

---

# 🧠 Why It Is Important

Controllers keep logic separate from routes.

Without controllers:

Routes become huge and unreadable.

---

# 🔐 Register Flow

```text
Receive Data
      │
      ▼
Check Existing User
      │
      ▼
Hash Password
      │
      ▼
Save User
      │
      ▼
Send Response
```

---

# 🔐 Login Flow

```text
Find User
    │
    ▼
Compare Password
    │
    ▼
Generate JWT
    │
    ▼
Return Token
```

---

# 🧱 Default Code

```js
const User = require('../models/User');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');


// REGISTER

exports.register = async(req,res) => {

    try{

        const {username,password} = req.body;

        const existingUser =
        await User.findOne({username});

        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }

        const hashedPassword =
        await bcrypt.hash(password,12);

        await User.create({
            username,
            password:hashedPassword
        });

        res.status(201).json({
            message:"User created successfully"
        });

    } catch(error){

        res.status(500).json({
            message:error.message
        });

    }
};


// LOGIN

exports.login = async(req,res) => {

    try{

        const {username,password} = req.body;

        const user =
        await User.findOne({username});

        if(!user){
            return res.status(400).json({
                message:"User not found"
            });
        }

        const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch){
            return res.status(400).json({
                message:"Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id:user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn:'1h'
            }
        );

        res.json({token});

    } catch(error){

        res.status(500).json({
            message:error.message
        });

    }
};
```

---

# 📘 Concepts Learned

- Controllers
- Authentication
- Password Hashing
- JWT Generation
- Async Await

---

# 📄 6️⃣ middleware/authMidd.js

# 📌 Purpose

Protect routes using JWT verification.

---

# ✅ Responsibilities

- Read token
- Verify token
- Allow or deny access

---

# 🧠 Why It Is Important

Without middleware:

Anyone can access protected routes.

Middleware acts like a security guard.

---

# 🔄 Middleware Flow

```text
Request
   │
   ▼
Read Token
   │
   ▼
Verify Token
   │
 ┌─┴────────┐
 ▼          ▼
Valid      Invalid
 │           │
 ▼           ▼
Next()     Error
```

---

# 🧱 Default Code

```js
const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {

    const authHeader =
    req.headers.authorization;

    if(!authHeader){

        return res.status(401).json({
            message:"No token provided"
        });

    }

    const token =
    authHeader.split(' ')[1];

    try{

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch(error){

        return res.status(401).json({
            message:"Invalid token"
        });

    }
};
```

---

# 📘 Concepts Learned

- Middleware
- Authorization
- JWT Verification
- Protected Routes

---

# 🔑 What Is JWT?

JWT = JSON Web Token

It is used for authentication.

---

# 🔄 JWT Flow

```text
Login
   │
   ▼
Generate Token
   │
   ▼
Send Token To Client
   │
   ▼
Client Stores Token
   │
   ▼
Client Sends Token
   │
   ▼
Server Verifies Token
```

---

# 📦 JWT Structure

```text
HEADER.PAYLOAD.SIGNATURE
```

Example:

```text
eyJhbGciOiJIUzI1Ni...
```

---

# 🔐 Why Hash Passwords?

Never store:

```text
123456
```

Store:

```text
$2b$12$LKD9s...
```

---

# 🧠 Why Use bcrypt?

bcrypt converts passwords into secure hashes.

Even if database leaks:

Attackers cannot easily know real passwords.

---

# 📬 API Endpoints

---

# Register

```http
POST /api/auth/register
```

Body:

```json
{
  "username":"komal",
  "password":"123456"
}
```

---

# Login

```http
POST /api/auth/login
```

Body:

```json
{
  "username":"komal",
  "password":"123456"
}
```

---

# Protected Route

```http
GET /api/protected
```

Headers:

```http
Authorization: Bearer TOKEN
```

---

# 🚀 What You Learned

✅ Express Server  
✅ MongoDB Connection  
✅ Models  
✅ Controllers  
✅ Routes  
✅ Middleware  
✅ JWT Authentication  
✅ Password Hashing  
✅ Protected APIs  
✅ REST APIs  
✅ Environment Variables

---

# 🎯 Real World Usage

JWT Authentication is used in:

- Android Apps
- React Apps
- Banking Apps
- E-commerce Apps
- Social Media Apps
- Admin Dashboards
- SaaS Platforms

---

# 📚 Next Things To Learn

After this project:

- Refresh Tokens
- Logout System
- Role-Based Authentication
- OTP Login
- Email Verification
- Password Reset
- Cookies Authentication
- Access & Refresh Tokens
- RBAC
- OAuth
- Google Login

---

# 🏁 Final Summary

This project teaches the complete beginner backend flow:

```text
Request
   │
   ▼
Route
   │
   ▼
Controller
   │
   ▼
Database
   │
   ▼
JWT Authentication
   │
   ▼
Protected APIs
```

This is the foundation of modern backend authentication systems.

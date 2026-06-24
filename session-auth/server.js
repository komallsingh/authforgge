const express=require("express");
const session=require("express-session");
const { MongoStore } = require("connect-mongo");
const app=express();
app.use(express.json());
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const PORT = process.env.PORT;

const connectDB = require("./config/db");

connectDB();



app.use(
    session({
        secret: process.env.SESSIONSECRETKEY,
        resave: false,
        saveUninitialized: false,
        store:
        MongoStore.create({
            mongoUrl: process.env.MONGODB_URL
        }),

        cookie:{
            maxAge: 1000*60*60*24 //1 day
        }
    })
)

//routes 
const authRoutes = require("./routes/authRoute");
app.use("/auth", authRoutes);

const authMidd =require("./middleware/authMid");

app.get(
    "/profile",
    authMidd,
    (req,res)=>{

        res.json({

            message:
            "Protected Route",

            user:
            req.session.user

        });

    }
);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const User=require('../models/User');
const bcrypt = require("bcryptjs");

//register

exports.register=async(req,res)=>{
    try{
        const {username,password} = req.body;

        const existingUser=await User.findOne({username});

        if(existingUser){
            return res.status(400).json({
                message: "user already exists"
            });
        }

        const hashedPass = await bcrypt.hash(password,10);

        await User.create({
            username,
            password:hashedPass
        });

        res.status(201).json({
            message:"User registered successfully"
        });
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
};

//login
 
exports.login = async(req,res)=>{
    const {username,password}=req.body;
    const user=await User.findOne({username});

    if(!user){
        return res.status(400).json({
            message:"user not found"
        })
    }

    const isMatch=await bcrypt.compare(
        password,user.password
    );
    if(!isMatch){
        return res.status(400).json({
            message:"wrong password"
        });
    }

    //we create a session here after login

    req.session.user = {
        id:user._id,
        username:user.username
    };

    res.json({
        message: "login successfull"
    });
};


//logout 

exports.logout=(req,res)=>{
    req.session.destroy();

    res.json({
        message: "logged out"
    });
};
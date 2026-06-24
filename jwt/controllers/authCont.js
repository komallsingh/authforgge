const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

//register

exports.register=async(req,res)=>{
    try{
        const {username,password}=req.body;

        const existingUser=await User.findOne({username});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        const hashedPassword=await bcrypt.hash(password,12);
        const newUser=await User.create({
            username,
            password:hashedPassword
        });

        res.status(201).json({message:"User created successfully"});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}

//LOGIN

exports.login=async(req,res)=>{
    try{
        const {username,password}=req.body;

        const user=await User.findOne({username});
        if(!user){
            return res.status(400).json({message:"User does not exist"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const token=jwt.sign({
            id:user._id},
            process.env.JWTSECRETKEY,
            {expiresIn:'1h'});
        res.json({token});
    } 
    catch (error) {
        res.status(500).json({message:error.message});
    }
}
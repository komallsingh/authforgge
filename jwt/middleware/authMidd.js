const jwt= require('jsonwebtoken');

module.exports=(req,res,next)=>{
    const authHeader=req.headers.authorization; //reads the authorization header from the request (bearer token)
    if(!authHeader){
        return res.status(401).json({message:"No token, authorization denied"});
    }

    const token=authHeader.split(' ')[1]; // gets the 1st index value => token

    try{
        const decoded=jwt.verify(token,process.env.JWTSECRETKEY);
        req.user=decoded;
        next();
    } catch (error) {
        res.status(401).json({message:"Invalid token"});
    }
}

//module.exports means export thus fn as midleware
// req-> authmiddlware-> controller-> response

// req=> req.header, req.params, req.body, req.query, req.user
// res=> res.status, res.json, res.send, res.redirect
//next -> pass control to next middleware or controller
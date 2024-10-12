const jwt = require('jsonwebtoken')
const secretKey='secret-key';

// generate a token

function generateToken(user){

  const payload ={
    username:user.username,
    password:user.password,
  }
   const token=jwt.sign(payload,secretKey,{expiresIn:'1h'});
   return token;
}

// verify the token
function verifyToken(req,res,next){
  const authHeader=req.headers['authorization'];
  if(authHeader){
    const token = authHeader.split(' ')[1];
//   const token = authHeader;
  if(token==null){
    res.status(401).json({message: "Invalid authorization"})
    return;
  }
  jwt.verify(token,secretKey,(err,user)=>{
    if(err){
        res.status(400).json({message: "Invalid authorization"})
        return;
    }
    req.user = user;
    next();
  })
}
}
module.exports = {generateToken,verifyToken}

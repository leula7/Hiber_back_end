import  Jwt  from "jsonwebtoken";
import { expressjwt } from "express-jwt";

function verifyToken(req, res, next) {

  const authHeader = req.headers.authorization;
  const secreteKey =process.env.ACCESS_TOKEN_SECRET;
  const protect= expressjwt({ secret: secret,algorithms: ['HS256'] });

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    Jwt.verify(token, secreteKey, (err, user) => {
      if (err) {
        if(err.name === 'TokenExpiredError' && err.message ==='jwt expired'){
          console.log("expired")
           return res.json({ message: 'Invalid token' });
        }
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Authorization header missing' });
  }
}

export default verifyToken;

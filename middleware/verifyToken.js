const jwt = require("jsonwebtoken");


function verifyToken (req, res, next) {
    const authHeader = req.headers.token;
    
    if(authHeader) {
        const token = authHeader.split(" ")[1];
        
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if(err) res.status(401).json("Token is not valid!");
            req.user = user;
            next();
        });
    }else{
        res.status(401).json("You are not authenticated!")
    }
};

const verifyTokenandAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.admin){
            next();
        }else{
            res.status(403).json("You are not allowed to do that!");
        };
    });
};

const verifyTokenandAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.admin) {
        next();
      } else {
        res.status(403).json("You are not allowed to do that!");
      }
    });
};

module.exports = { verifyToken, verifyTokenandAuthorization, verifyTokenandAdmin };
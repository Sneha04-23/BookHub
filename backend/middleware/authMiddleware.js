const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try{
        // get token from header

        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                message:"No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        if(!token){
            return res.status(401).json({
                message:"No token, authorization denied"
            });
        }

        // verify token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attach user data to request
        req.user = decoded;
        
        next();
        

    } catch(err) {
        res.status(401).json({
            message:"Invalid token",
            error:err.message
        });
    }
};

module.exports = authMiddleware 
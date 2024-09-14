const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    try {
        let token;
        if(req.headers.authorization)
           token = req.headers.authorization.split(" ")[1];

        if(!token)
            return res.status(401).json({ message: "Please Login to continue" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = decoded;
        req.token = token;
        next();

    } catch (err) {
        console.log(err.message);
        if(err.message == "jwt expired")
            return res.status(401).json({ message: "Please Login to continue" });

        res.status(500).json({ message: err.message });
    }
};

module.exports = verifyToken;
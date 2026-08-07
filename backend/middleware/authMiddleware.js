const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {

        token = req.headers.authorization.split(" ")[1];

        try {

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            req.user = {
                id: decoded.id,
                role: decoded.role
            };

            next();

        } catch (err) {

            return res.status(401).json({
                success: false,
                message: "Invalid Token"
            });
        }

    } else {

        return res.status(401).json({
            success: false,
            message: "No Token Provided"
        });
    }
};

module.exports = { protect };
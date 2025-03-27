import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.headers?.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
              message: "No token provided",
              success: false,
              error: true,
            });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false,
                error: true,
            });
        }
        req.userId = decoded.id;
        
        next();

    } catch (error) {
        res.status(500).json({
            message: "You have not logged in",
            success: false,
            error: true,
        });
    }
};

export default auth;
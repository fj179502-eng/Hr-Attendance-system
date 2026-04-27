import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: "No token provided or malformed header" });
    }
    const token = authHeader.split(" ")[1];
    try {
        console.log("Validation Token", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error("JWT Validation Error", err);
        return res.status(401).json({ message: "Invalid Token" });
    }
}

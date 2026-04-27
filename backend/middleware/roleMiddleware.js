export const allowRoles = (...role) => {
    return (req, res) => {
        if (!role.includes(req.user.role)) {
            return res.status(403).json("No roe found");
        }
        if (!allowRoles.includes(req.user.role)) {
            return res.status(403).json("Access Denid");
        }
    }

}
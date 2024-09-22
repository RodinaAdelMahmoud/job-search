export function authorizeRoles(roles) {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            next(); // User is authorized, continue to the next middleware or route handler
        } else {
            res.status(403).json({ message: 'Unauthorized' }); // User does not have the required role
        }
    };
}

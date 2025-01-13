export function authorizeRoles(...roles) {
    return (req, res, next) => {
        console.log('authorizeRoles Middleware:');
        console.log('User from token:', req.user.role);
        console.log('Allowed roles:', roles);
        if (!req.user) {
            console.error('Access denied: No user information in request.');
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }

        const { role } = req.user;

        if (!roles.includes(role)) {
            console.error(`Access denied: Role '${role}' does not have access. Expected roles: ${roles.join(', ')}`);
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }

        next();
    };
}

// Middleware to check user permissions
const Role = require("@model/role");
function can(permissions=[]) {
    return async (req, res, next) => {
        const acceptHeader = req.get('Accept');
        // Assuming req.user.permissions is an array of user permissions
        if(!req.session.user){
            if (req.originalUrl.startsWith('/api') || (acceptHeader && acceptHeader.includes('application/json'))) {
                return res.response("unauthorized", 403);
           }else{
               return res.render("unauthorized");
           }
        }
        
        if (permissions.length ==0) {
            return next(); // Proceed to the route handler
        }
        const role = await Role.findOne({_id:req.session.user.role});
        // Check if user has any of the required permissions
        const hasPermission = permissions.some(permission => role.permissions.includes(permission));
        
        if (hasPermission) {
            return next(); // Proceed to the route handler
        } else {
            if (req.originalUrl.startsWith('/api') || (acceptHeader && acceptHeader.includes('application/json'))) {
                 return res.response("unauthorized", 403);
            }else{
                return res.render("unauthorized");
            }
        }
    };
}

module.exports = can;
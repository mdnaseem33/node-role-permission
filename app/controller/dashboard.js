const asyncHandler = require("@utils/asyncHandler")
exports.dashboard = asyncHandler(async(req, res)=> {
    res.dashboard("dash");
});

exports.logout = asyncHandler(async(req, res)=> {
    req.session.destroy();
    res.redirect("/");
});
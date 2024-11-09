const asyncHandler = require("@utils/asyncHandler")
const User = require("@model/user")
exports.login = asyncHandler(async(req, res)=>{

    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        return res.response("invalid user", 300);
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.response("invalid password", 300);
    }
    req.session.user = user;
    res.response("logged in", 200)

});
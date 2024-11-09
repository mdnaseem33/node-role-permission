require('module-alias/register');
const connectDB = require("@utils/mongodb.js")
connectDB();

const permissions = require("./../app/utils/permission");
const Role = require("@model/role");
const user = require("@model/user");

const seed = async () => {
    let role = await Role.findOne({name: "Super Admin"});
    if (!role) {
        console.log("Super Admin role not found");
        process.exit();
    }

    let u = await user.findOne({username: "admin"});
    console.log(u);
    if(!u){
        u = new user({
            username: "admin",
            password: "12345678",
            role: role._id
        });
        await u.save();
        console.log("Super Admin user created");
        
    }

    process.exit();
};

seed();
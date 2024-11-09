require('module-alias/register');
const connectDB = require("@utils/mongodb.js")
connectDB();

const permissions = require("./../app/utils/permission");
const Role = require("@model/role");

const seed = async () => {
    let role = await Role.findOne({name: "Super Admin"});
    if (!role) {
        role = new Role({name: "Super Admin"});
    }

    permissions.forEach(async (permission) => {
        role.permissions.addToSet(permission.name);
    });

    await role.save();
    console.log("Super Admin role permissions updated");
    process.exit();
};

seed();
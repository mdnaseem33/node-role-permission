const asyncHandler = require("@utils/asyncHandler");
const permission = require("@utils/permission");
const Role = require("@model/role");
const User = require("@model/user");
const mongoose = require("mongoose");
exports.roles = asyncHandler(async (req, res, next) => {

    res.dashboard("hrm/roles", {permission}, [ "module/hrm/role.js" ]);
});

exports.createRoles = asyncHandler(async (req, res, next) => {

    const groupedPermissions = permission.reduce((acc, permission) => {
        if (!acc[permission.group]) {
            acc[permission.group] = [];
        }
        acc[permission.group].push(permission);
        return acc;
    }, {});

    res.dashboard("hrm/create-role", {permission : groupedPermissions });
});

exports.postRoles = asyncHandler(async (req, res, next) => {
    const {name, permission} = req.body;
    
    if(name.length < 3) {
        req.flash("error", "Role name must be at least 3 characters long");
        return res.redirect("/roles/create" );
    }
    const role = new Role({name, permissions: permission});
    await role.save();
    req.flash("success", "Role created successfully");
    res.redirect("/roles");
});

exports.roleDatatable = asyncHandler(async (req, res, next) => {
    const { draw, start, length, search, order } = req.query;
    // Prepare pagination
    const limit = parseInt(length, 10);
    const skip = parseInt(start, 10);

    // Build query for search (filter)
    let query = {};
    if (search && search.value) {
      const searchValue = search.value.toLowerCase();
      query = {
        $or: [
            { _id: mongoose.Types.ObjectId.isValid(searchValue) ? mongoose.Types.ObjectId(searchValue) : { $exists: false } }, 
          { name: { $regex: searchValue, $options: 'i' } }
        ]
      };
    }

    // Sort handling (DataTables sends column index and direction)
    let sort = {};
    if (order && order[0]) {
      const { column, dir } = order[0];
      const sortField = ['_id','name', 'createdAt'][column];
      sort[sortField] = dir === 'asc' ? 1 : -1;
    }
    // Fetch data from MongoDB
    const roles = await Role.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort);
      
    const modifiedRoles = roles.map(role => {
        
        const createdAtFormatted = role.createdAt.toLocaleDateString();  
        
        
        const roleStatus = new Date() - role.createdAt < 30 * 24 * 60 * 60 * 1000 ? 'Active' : 'Inactive';
        const action = `<a href="/roles/${role._id}/edit" class="btn btn-primary btn-sm">Edit</a>
        <a href="/roles/${role._id}/delete" class="btn btn-danger btn-sm">Delete</a>`
        
        return {
        ...role.toObject(), 
        createdAtFormatted,
        roleStatus,
        action
        };
    });
  
    const totalRecords = await Role.countDocuments(query);

    // Send response in DataTable format
    res.json({
      draw: parseInt(draw, 10),
      recordsTotal: totalRecords,
      recordsFiltered: totalRecords,
      data: modifiedRoles,
    });

});

exports.editRoles = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const role = await Role.findById(id);
    if(!role) {
        req.flash("error", "Role not found");
        return res.redirect("/roles");
    }
    const groupedPermissions = permission.reduce((acc, permission) => {
        if (!acc[permission.group]) {
            acc[permission.group] = [];
        }
        acc[permission.group].push(permission);
        return acc;
    }, {});
    res.dashboard("hrm/edit-role", {role, permission:groupedPermissions});
});

exports.updateRoles = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const {name, permission} = req.body;
    const role = await Role.findById(id);
    if(!role) {
        req.flash("error", "Role not found");
        return res.redirect("/roles");
    }
    role.name = name;
    role.permissions = permission;
    await role.save();
    req.flash("success", "Role updated successfully");
    res.redirect("/roles");
});

exports.deleteRoles = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const role = await Role.findById(id);
    if(!role) {
        req.flash("error", "Role not found");
        return res.redirect("/roles");
    }
    const userWithRole = await User.findOne({ role: role._id });
    if(userWithRole) {
        req.flash("error", "Role is in use");
        return res.redirect("/roles");
    }
    await role.deleteOne();
    req.flash("success", "Role deleted successfully");
    res.redirect("/roles");
});

exports.users = asyncHandler(async (req, res, next) => {
    res.dashboard("hrm/users", {}, [ "module/hrm/users.js" ]);
});


exports.createUsers = asyncHandler(async (req, res, next) => {

    const roles = await Role.find();

    res.dashboard("hrm/user-create", {roles });
});

exports.postUsers = asyncHandler(async (req, res, next) => {
    const {name, username, password, role}  = req.body;
    if(name.length < 3) {
        req.flash("error", "Name must be at least 3 characters long");
        return res.redirect("/users/create" );
    }
    if(username.length < 3 || username.length > 20 || username.includes(" ")) {
        req.flash("error", "Username must be at least 3 characters long and less than 20 characters long and doesnot contain any space");
        return res.redirect("/users/create" );
    }
    if(password.length < 6) {
        req.flash("error", "Password must be at least 6 characters long");
        return res.redirect("/users/create" );
    }
    const checkRole = await Role.findById(role);
    if(!checkRole) {
        req.flash("error", "Role not found");
        return res.redirect("/users/create" );
    }
    const user = new User({name, username, password, role});
    await user.save();
    
    req.flash("success", "User created successfully");
    res.redirect("/users");
});

exports.userDatatable = asyncHandler(async (req, res, next) => {
    const { draw, start, length, search, order } = req.query;
    // Prepare pagination
    const limit = parseInt(length, 10);
    const skip = parseInt(start, 10);

    // Build query for search (filter)
    let query = {};
    if (search && search.value) {
      const searchValue = search.value.toLowerCase();
      query = {
        $or: [
            { _id: mongoose.Types.ObjectId.isValid(searchValue) ? mongoose.Types.ObjectId(searchValue) : { $exists: false } }, 
          { name: { $regex: searchValue, $options: 'i' } },
          {username: { $regex: searchValue, $options: 'i' }},
          { 'role.name': { $regex: searchValue, $options: 'i' } }
        ]
      };
    }

    // Sort handling (DataTables sends column index and direction)
    let sort = {};
    if (order && order[0]) {
      const { column, dir } = order[0];
      const sortField = ['_id','name','username','role.name', 'createdAt'][column];
      sort[sortField] = dir === 'asc' ? 1 : -1;
    }
    // Fetch data from MongoDB
    const users = await User.find(query)
    .populate({
        path: 'role',
        select: 'name', 
      })
      .skip(skip)
      .limit(limit)
      .sort(sort);
      
    const modifiedUsers = users.map(user => {
        
        const createdAtFormatted = user.createdAt.toLocaleDateString();  
        
        const action = `<a href="/users/${user._id}/edit" class="btn btn-primary btn-sm">Edit</a>
        <a href="/users/${user._id}/delete" class="btn btn-danger btn-sm">Delete</a>`
        
        return {
        ...user.toObject(), 
        createdAtFormatted,
        roleName: user.role ? user.role.name : '',
        action
        };
    });
  
    const totalRecords = await User.countDocuments(query);

    // Send response in DataTable format
    res.json({
      draw: parseInt(draw, 10),
      recordsTotal: totalRecords,
      recordsFiltered: totalRecords,
      data: modifiedUsers,
    });

});

exports.editUsers = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const role = await Role.findById(id);
    if(!role) {
        req.flash("error", "Role not found");
        return res.redirect("/roles");
    }
    const groupedPermissions = permission.reduce((acc, permission) => {
        if (!acc[permission.group]) {
            acc[permission.group] = [];
        }
        acc[permission.group].push(permission);
        return acc;
    }, {});
    res.dashboard("hrm/edit-role", {role, permission:groupedPermissions});
});

exports.updateUsers = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const {name, permission} = req.body;
    const role = await Role.findById(id);
    if(!role) {
        req.flash("error", "Role not found");
        return res.redirect("/roles");
    }
    role.name = name;
    role.permissions = permission;
    await role.save();
    req.flash("success", "Role updated successfully");
    res.redirect("/roles");
});

exports.deleteUsers = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const role = await Role.findById(id);
    if(!role) {
        req.flash("error", "Role not found");
        return res.redirect("/roles");
    }
    const userWithRole = await User.findOne({ role: role._id });
    if(userWithRole) {
        req.flash("error", "Role is in use");
        return res.redirect("/roles");
    }
    await role.deleteOne();
    req.flash("success", "Role deleted successfully");
    res.redirect("/roles");
});
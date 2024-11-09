const permissions = [
    // Users
    {name: "user.browse",view:"User browse",  group: "User"},
    {name: "user.create",view:"User Create", group: "User"},
    {name: "user.update",view:"User Update", group: "User"},
    {name: "user.delete",view:"User Delete", group: "User"},
    // Roles
    {name: "role.browse",view:"Role browse", group: "Role"},
    {name: "role.create",view:"Role Create", group: "Role"},
    {name: "role.update",view:"Role Update", group: "Role"},
    {name: "role.delete",view:"Role Delete", group: "Role"},
];

module.exports = permissions;
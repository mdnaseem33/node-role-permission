exports.menu = [
    {name: "Dashboard", url: "/dashboard", icon: "home", permission:[]},
    {name: "HRM", url: "#", icon: "users",permission:["user.browse", "role.browse"], child: [
        {name: "Roles", url: "/roles", icon: "fa fa-user", permission:["role.browse"]},
        {name: "Users", url: "/users", icon: "fa fa-user", permission:["user.browse"]}
    ]},
];

exports.filterMenu = (mainMenu, permissions) => {
    const menu = JSON.parse(JSON.stringify(mainMenu));
    return menu.filter(item => {
        if (item.child) {
            item.child = item.child.filter(childItem => {
                return permissions.some(permission => childItem.permission.includes(permission));
            });
            return item.child.length > 0;
        } else {
            if(item.permission.length == 0){
                return item;
            }
            return permissions.some(permission => item.permission.includes(permission));
        }
    });
};
const express = require("express");
const can = require("../app/middleware/can");
const router = express.Router();
const auth = require("@controller/auth.controller");
const dashboard = require("@controller/dashboard");
const hrm = require("@controller/hrm.controller");
router.get("/", (req, res) => {
    if(req.session.user){
        return res.redirect("/dashboard");
    }
    res.render('login');
});

router.post("/login", auth.login );

router.get("/dashboard", can(), dashboard.dashboard);
router.post("/logout", can(), dashboard.logout);
// roles 
router.get("/roles",can([ "role.browse" ]),  hrm.roles);
router.get("/roles/create", can([ "role.create" ]), hrm.createRoles);
router.post("/roles/create", can([ "role.create" ]), hrm.postRoles);
router.get("/roles/datatable", can([ "role.browse" ]), hrm.roleDatatable);
router.get("/roles/:id/edit", can([ "role.update" ]), hrm.editRoles);
router.post("/roles/:id/edit", can([ "role.update" ]), hrm.updateRoles);
router.get("/roles/:id/delete", can([ "role.delete" ]), hrm.deleteRoles);

//users
router.get("/users", can([ "user.browse" ]), hrm.users);
router.get("/users/create", can([ "user.create" ]), hrm.createUsers);
router.post("/users/create", can([ "user.create" ]), hrm.postUsers);
router.get("/users/datatable", can([ "user.browse" ]), hrm.userDatatable);
router.get("/users/:id/edit", can([ "user.update" ]), hrm.editUsers);
router.post("/users/:id/edit", can([ "user.update" ]), hrm.updateUsers);
router.get("/users/:id/delete", can([ "user.delete" ]), hrm.deleteUsers);
module.exports = router;
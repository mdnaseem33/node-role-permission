const utils = require("@utils/utils");
const Role = require("@model/role");
const addRender = async(req,res, next)=>{
    res.dashboard = async (page, data={}, script=[], css=[]) => {
        const role = await Role.findOne({_id:req.session.user.role});
        const menu = utils.filterMenu(utils.menu, role.permissions);
        const error = req.flash("error");
        const success = req.flash("success");
        const warning = req.flash("warning");
        const info = req.flash("info");
        return res.render("dashboard", {
            page,
            data,
            req,
            script,
            css,
            menu,
            error,
            success,
            warning,
            info,
          });
    }

    res.response = ( message, status=200, data=[] ) =>{
        return res.send({
            status,
            message,
            data
        });
    }
    next();
}

module.exports = addRender
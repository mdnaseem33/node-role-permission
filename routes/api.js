const express = require("express");

const can = require("../app/middleware/can");
const router = express.Router();

router.get("/", can(["user.edit"]),  (req, res) => {
    res.render('login');
});
module.exports = router;
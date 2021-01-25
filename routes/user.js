const express = require("express");
const router = express.Router();

/* importation du controller user.js */
const userCtrl = require("../controllers/user");

/* création des routes avec endpoints appropriés pour les middlewares crées */
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;

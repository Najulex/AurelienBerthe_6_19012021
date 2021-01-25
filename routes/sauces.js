const express = require("express");
const router = express.Router();

/* importation du controller sauces.js et des middlewares auth et multer-config */
const sauceCtrl = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

/* création des routes avec endpoints appropriés pour les middlewares crées */
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;

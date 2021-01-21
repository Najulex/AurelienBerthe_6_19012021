const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/", sauceCtrl.getAllSauces);
router.get("/:id", sauceCtrl.getOneSauce);
router.delete("/:id", sauceCtrl.deleteSauce);
router.put("/:id", multer, sauceCtrl.modifySauce);

module.exports = router;

const mongoose = require("mongoose");

/* importation plugin unique-validator pour empêcher la création de plusieurs utilisateurs avec email identique */
const uniqueValidator = require("mongoose-unique-validator");

/* création schéma de données pour création d'utilisateur */
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

/* application de unique-validator avant exportation du schéma */
userSchema.plugin(uniqueValidator);

/* exportation du schéma mongoose */
module.exports = mongoose.model("User", userSchema);

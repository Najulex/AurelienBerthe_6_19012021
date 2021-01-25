/* création application express */
const express = require("express");
const app = express();

/* importation du package mongoose */
const mongoose = require("mongoose");

/* importation package path pour rendre dossier images static */
const path = require("path");

/* importation des routes utilisateurs et sauces */
const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");

/* connection de l'API au cluster mongoDB */
mongoose
  .connect(
    "mongodb+srv://Najulex:XoabjQW52Gqgk8Zh@cluster-p6.vazxj.mongodb.net/dbSopekocko?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

/* importation package body-parser pour transformer corps de la requète */
const bodyParser = require("body-parser");
app.use(bodyParser.json());

/* ajout headers pour permettre l'accès à l'API depuis toutes les adresses IP et pour touts les endpoints */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

/* indication express gestionnaire de routage /images en static */
app.use("/images", express.static(path.join(__dirname, "images")));

/* appel fonction user et sauces aux endpoints appropriés */
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

module.exports = app;

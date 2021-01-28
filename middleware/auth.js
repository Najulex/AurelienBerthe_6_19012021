/* importation du package json-web-token */
const jwt = require("jsonwebtoken");

/* création middleware d'authentification grâce à jwt */
module.exports = (req, res, next) => {
  try {
    /* récupération du token présent dans le header de la requète */
    const token = req.headers.authorization.split(" ")[1];
    /* décodage du token */
    const decodedToken = jwt.verify(token, "xMOlpW5568wRZ27JUamdsj1VfZNI14");
    /* récupération de l'userId dans le token décodé */
    const userId = decodedToken.userId;
    /* si l'userId ne correspond pas avec l'userId présent dans le corps de la requête alors erreur
    si il correspond alors on passe au middleware suivant avec next */
    if (req.body.userId && req.body.userId !== userId) {
      throw "ID d'utilisateur non valide !";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Requète invalide !"),
    });
  }
};

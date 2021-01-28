/* importation model user créé */
const User = require("../models/User");

/* importation package bcrypt pour crypter les mdp stockés dans la BDD */
const bcrypt = require("bcrypt");

/* importation package jsonwebtoken pour création de token
d'authentification à la connexion des utilisateurs */
const jwt = require("jsonwebtoken");

/* importation package sha1 pour hasher mdp */
const sha1 = require("sha1");

/* enregistrement de l'user dans la BDD */
exports.signup = (req, res, next) => {
  /* application de bcrypt sur le mot de passe avec méthode hash */
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      /* création d'une instance du modèle user avec email masqué et mdp hashé */
      const user = new User({
        email: sha1(req.body.email),
        password: hash,
      });
      /* save enregistre dans la BDD et renvoie une promise avec code réussite ou erreur */
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/* récupération d'un utilisateur dans la BDD avec méthode findOne et l'email en paramètre */
exports.login = (req, res, next) => {
  User.findOne({ email: sha1(req.body.email) })
    .then((user) => {
      /* si user non trouvé message erreur */
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      /* si user trouvé, comparaison du mdp du corps de la requète 
      avec mdp enregistré dans la BDD avec méthode bcrypt compare */
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          /* si non correspondant alors message erreur */
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          /* si correspondant alors l'API renvoie l'userId et un token
          créé avec json-web-token contenant cet userId et valable une journée*/
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

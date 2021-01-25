/* importation model sauce créé */
const Sauce = require("../models/Sauce");

/* importation package fs de node */
const fs = require("fs");

/* enregistrement des sauces dans la BDD */
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  /* création d'une instance du modèle sauce en récupérant le corps de la requète */
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  /* save enregistre dans la BDD et renvoie une promise avec code réussite ou erreur */
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Sauce ajoutée !",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

/* récupération des sauces dans la BDD avec méthond find */
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

/* récupération d'une sauce dans la BDD avec méthode findOne et l'id en paramètre */
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => res.status(400).json({ error }));
};

/* supression d'une sauce de la BDD avec méthode findOne pour la retrouver et deleteOne pour la supprimer */
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

/* modification d'une sauce de la BDD avec méthode updateOne et id en paramètre */
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

/* modification du like des sauces en BDD avec méthode updateOne */
exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  /* si like alors +1 sur le champ like de la sauce et push de l'userId 
  dans le tableau usersLiked sur l'id de la sauce passé en paramètre */
  if (like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: "Sauce likée !" }))
      .catch((error) => res.status(400).json({ error }));
  } else if (like === -1) {
    /* si dislike alors +1 sur le champ dislike de la sauce et push de l'userId 
    dans le tableau usersDisliked sur l'id de la sauce passé en paramètre */
    Sauce.updateOne(
      { _id: req.params.id },
      { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: "Sauce dislikée !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    /* sinon vérification de la présence de l'userId dans le tableau correspondant avec indexOf */
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        /* si l'userId est présent dans le tableau usersLiked alors -1 sur le champ like et 
        pull de l'userId dans le tableau usersLiked sur l'id de la sauce passé en paramètre */
        if (sauce.usersLiked.indexOf(req.body.userId) > -1) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
          )
            .then(() => res.status(200).json({ message: "Sauce non likée !" }))
            .catch((error) => res.status(400).json({ error }));
          /* si l'userId est présent dans le tableau usersDisliked alors -1 sur le champ dislike et 
            pull de l'userId dans le tableau usersDisliked sur l'id de la sauce passé en paramètre */
        } else if (sauce.usersDisliked.indexOf(req.body.userId) > -1) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
            }
          )
            .then(() =>
              res.status(200).json({ message: "Sauce non dislikée !" })
            )
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => json.status(400).json({ error }));
  }
};

/* importation package multer pour gèrer les fichiers entrants dans les requètes HTTP */
const multer = require("multer");

/* création dictionnaire de type MIME pour extension de fichier */
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

/* création constante storage pour indiquer à multer où stocker les fichiers entrants */
const storage = multer.diskStorage({
  /* enregistrement dans le dossier images */
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  /* édition du nom du fichier final contenant le nom d'origine avec underscores au lieu d'espaces 
  puis un time stamp suivi d'un point et l'extension du fichier créée grâce à MIME_TYPES */
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

/* exportation de l'élément multer avec constante storage */
module.exports = multer({ storage: storage }).single("image");

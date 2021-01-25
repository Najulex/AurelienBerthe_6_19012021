/* importation du package http natif de node */
const http = require("http");

/* importation de l'application app.js */
const app = require("./app");

app.set("port", process.env.PORT || 3000);

/* création serveur basique pour écoute port env ou port par défaut 3000 */
const server = http.createServer(app);

server.listen(process.env.PORT || 3000);

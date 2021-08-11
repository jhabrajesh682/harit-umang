require("dotenv").config();
const server = require("./app/server");
const db = require("./app/startup/db");

const { info } = require("./app/utils/chalk");

console.log(new Date())


const port = process.env.PORT;
let serverlisten = server.listen(port, () => {
  db();
  console.log(info("Server started on port " + port));

});

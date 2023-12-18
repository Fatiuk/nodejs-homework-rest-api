const app = require("./app");
const mongoose = require("mongoose");

const { DB_SERVER_HOST, DB_SERVER_PORT = 8080 } = process.env;

mongoose
  .connect(DB_SERVER_HOST)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(DB_SERVER_PORT);
    console.log(`Server is running on port ${DB_SERVER_PORT}`);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

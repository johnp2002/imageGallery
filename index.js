const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const { getDatabaseInstance } = require('./config/db');
const dbInstance = getDatabaseInstance();
app.use(express.static("public"));
// dbInstance.
app.get("/", (req, res) => {
  try {
    const pg = fs.readFileSync(
      path.join(__dirname, "pages/index.html"),
      "utf8"
    );
    // console.log(pg);
    
    res.send(pg);
  } catch (error) {
    console.log(error);

    res.status(500).send("Internal Server Error");
  }
});

app.listen(4000, (err) => {
  if (err) {
    return console.log("error while runiing server" + err);
  }
  console.log("server running successfully port 4000");
});

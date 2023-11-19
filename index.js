const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const multer = require("multer");
const { Buffer } = require('buffer');
const app = express();
const fs = require("fs");
const path = require("path");
const { getDatabaseInstance } = require("./config/db");
const dbInstance = getDatabaseInstance();
const User = require("./models/userModel");
const Image = require("./models/imageModel")
require("./config/auth");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function isLoggedIn(req, res, next) {
  req.user ? next() : res.redirect("/");
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

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

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/protected", isLoggedIn, (req, res) => {
  console.log(req.user.emails[0].value);
  const userEmail = req.user.emails[0].value;
  User.findOne({ email: userEmail })
    .then((existingUser) => {
      if (existingUser) {
        // User already exists, handle the case accordingly
        console.log("User already exists:", existingUser);
        // Add your logic for handling existing users, e.g., redirect or return an error response
      } else {
        // User does not exist, create a new user
        return User.create({ email: userEmail });
      }
    })
    .then((newUser) => {
      if (newUser) {
        // New user created successfully
        console.log("New user created:", newUser);
        // Add your logic for handling the creation of a new user
      }
    })
    .catch((err) => {
      // Handle errors
      console.error(err);
    });
  try {
    const pg = fs.readFileSync(
      path.join(__dirname, "pages/dashboard.html"),
      "utf8"
    );
    // console.log(pg);

    res.send(pg);
  } catch (error) {
    console.log(error);

    res.status(500).send("Internal Server Error");
  }
  // res.send(`Hello ${req.user.displayName}`);
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Error during logout");
    }
    req.session.destroy(() => {
      // res.send("Goodbye!");
      res.end();
    });
  });
});

app.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

app.post("/upload", upload.single("imageData"), async (req, res) => {
  // Access the uploaded file through req.file
  const uploadedFile = req.file;
  const userEmail = req.user.emails[0].value;
  console.log(req.user.emails[0].value + "from poast route")
  if (!uploadedFile) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Process the file as needed (e.g., save it to a database, etc.)

  // Send a response to the client
  try {
    // Create a new Image document
    const newImage = new Image({
      userEmail: userEmail, // Replace with the user's email or retrieve it from the request
      imageData: uploadedFile.buffer,
    });

    // Save the image to MongoDB
    await newImage.save();

    // Send a response to the client
    res.json({ message: "File uploaded successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/details',isLoggedIn,(req,res)=>{
  res.json(req.user)
})

app.get("/getImages", async (req, res) => {
  // Check if req.user exists and has the necessary properties
  const userEmail = req.user && req.user.emails && req.user.emails[0] && req.user.emails[0].value;

  if (!userEmail) {
    return res.status(400).json({ error: "User email not found in the request" });
  }

  try {
    // Find all images for the user based on their email in the database
    const images = await Image.find({ userEmail }).exec();
    
    // Extract image data as Blobs and convert them to base64
    const imageBlobs = images.map((image) => ({
      userEmail: image.userEmail,
      imageData: Buffer.from(image.imageData, 'binary').toString('base64'),
    }));

    // Send the JSON array of Blobs as the response
    res.json(imageBlobs);
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(5000, (err) => {
  if (err) {
    return console.log("error while runiing server" + err);
  }
  console.log("server running successfully port 5000");
});

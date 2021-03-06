const express = require("express");
const formidable = require("express-formidable");
const formidableMiddleware = require("express-formidable");
const stripe = require("stripe")(process.env.STRIPE_API_SECRET);
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
require("dotenv").config();

//Connexion a BDD
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose . set ( 'useCreateIndex' ,  true ) ;

//Import de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express();
app.use(formidableMiddleware());
app.use(formidable());
app.use(cors());
//Import des routes
const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");
app.use(userRoutes);
app.use(offerRoutes);
app.get("/",(req,res)=>{
  res.status(200).json({ message: "Bienvenu son mon serveur" });
  });

app.all("*",(req,res)=>{
res.status(400).json({ message: "Page not found" });
});

app.listen(process.env.PORT,()=>{
console.log("Server has started");
});
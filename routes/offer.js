const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const isAuthenticated = require("../middlewares/isAuthenticated");
const  offer = require("../models/offer");

router.post("/offer/publish",isAuthenticated,async(req,res)=>{
try {
    //on va creer une offre
    //Destructuring
    //const{title,description,price,condition,city,brand,size,color}=req.fields;
        const newOffer = new offer({
        
        product_name: req.fields.title,
        product_description: req.fields.description,
        product_price: req.fields.price,
        product_details: [
            {
                MARQUE: req.fields.brand
            },
            {
                TAILLE: req.fields.size
            },
            {
                ÉTAT: req.fields.condition
            },
            {
                COULEUR: req.fields.color
            },
            {
                EMPLACEMENT: req.fields.city
            }
        ],
        owner: req.user,
    },
);
//L'annonce s'enregistre sur cloudinary dans un dossier vinted avec l'id de l'offre 
    const picture = await cloudinary.uploader.upload(req.files.picture.path, {
        folder: `vinted/offer/${newOffer._id}`,
      });
// ajouter une clé product_image à newOffer
newOffer.product_image= picture;
// On sauvegarde l'annonce dans la base
await newOffer.save();  
    
return res.json(newOffer);   
} catch (error) {
    res.status(400).json({message:error.message});
}
});


module.exports = router;

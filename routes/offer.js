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

router.get("/offers",async(req,res)=>{
//READ ET FILTRER un tableau contenant l'ensemble des annonces
    try {
        const filters = {};
        let page ;
        let limit = Number(req.query.limit);
        const sort ={}; 
//Si le page:Number n'est pas transmis ou eagal a 0 on doit etre sur la 1er page
        if (Number(req.query.page) <1) {
            page = 1
        } else {
            page = Number(req.query.page)
        };
        if (req.query.title) {
           filters.product_name = new RegExp(req.query.title,"i");
        }
        if (req.query.priceMin) {
           filters.product_price = {$gte:Number(req.query.priceMin)};
           //await Offer.find({ product_price: { $gte: 100 }});
        }
        if (req.query.priceMax) {
            if (filters.priceMax) {
                filters.product_price.$lte = Number(req.query.priceMax); 
            }else{
                filters.product_price = {$lte:Number(req.query.priceMax)}; 
            }
        }
        if (req.query.sort==="price-asc") {
            sort.product_price=1;
        } else if (req.query.sort==="price-desc") {
            sort.product_price=-1;
        } 
            
            const offers = await offer.find(filters) // Dans un .find() on envoie toujours un OBJET
            .populate("owner","account")
            .limit(limit)
            .skip(limit * (page-1))
            .sort(sort);// Dans un .sort() on envoie toujours un OBJET
            //.select("product_name product_price")
            res.json(offers);
    
    } catch (error) {
        res.status(400).json({message:error.message});
    }
    });

router.get("/offer/:id", async (req, res) =>{
    //READ et Filtrer une annonce par ID
    try {
    const offers = await offer.findById(req.params.id)
    //const offers = await offer.find({_id:req.params.id})
    .populate("owner","account");
    res.json(offers);
    } catch (error) {
    res.status(400).json(error.message);    
    }
});
module.exports = router;

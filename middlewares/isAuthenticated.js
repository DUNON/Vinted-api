const User =require("../models/user");


const isAuthenticated =async(req,res,next)=>{
try {
//on verifie si token est bien envoyé
if (req.headers.authorization) {
   //On recupere le token envoyé
   const token = req.headers.authorization.replace("Bearer ", "");
   // Chercher le user qui possède ce token
   const user = await User.findOne({token:token}).select("_id token account");;
       if (user) {
           // ajouter une clé user à l'objet req
           req.user = user;
           return next();
           
       } else {
           return res.status(401).json({message: "Unauthorized"});
       }      
} else {
   res.status(401).json({message: "Unauthorized"});    
} 
   
} catch (error) {
    res.status(400).json({message : error.message});
}
};
module.exports = isAuthenticated;
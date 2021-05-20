const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.post("/user/signup",async(req,res)=>{
try {
const mail = await User.findOne({email:req.fields.email});
//si le mail existe je renvoie un message d'erreur
//sinon je passe a la creation si le username est present
        if (mail) {
            res.status(409).json({message:"the same email already exist"});
        } else if(req.fields.username) {
const password = req.fields.password;//azerty
const salt = uid2(16);//lr1swhwb7nJsHIG8
const hash = SHA256(password + salt).toString(encBase64);
//lHkmhY/6AXodSBhPYLDxxFNXGJ1PW9t2lj8FMorBwbM=
const token = uid2(64);//rZB9TnW0QBXKwqms
//Creation d'un Utilisateur
        const newUser = new User({
            email: req.fields.email,
            account:{username:req.fields.username,phone: req.fields.phone,},
            token: token,
            hash: hash,
            salt: salt,
        });
//Sauvegarde de l'utilisateur
        await newUser.save();
//reponse a l'utilisateur
        res.status(200).json({
            _id: newUser._id,
            token: token,
            account:{username:req.fields.username,phone:req.fields.phone},
                            });
        }else{
            res.status(400).json({message:"Username is missing"});
        };
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

router.post("/user/login",async(req,res)=>{
try {
const password = req.fields.password;
// Chercher le user qui veut se connecter (recherche dans la BDD)
const user = await User.findOne({email:req.fields.email});
if (user) {
    //on va verifier le password en generant un hash avec le salt enregistré ds la base
const hash = SHA256(password + user.salt).toString(encBase64);
        if (user.hash === hash) {
    res.status(200).json({
        _id: user._id,
        token: user.token,
        account:user.account,
                        });
        } else {
    res.status(400).json({message:"Invalid request"});
}
} else {
    res.status(400).json({message:"email does not exist"});
}

} catch (error) {
    res.status(400).json({message:error.message});
    
}
});

module.exports=router;

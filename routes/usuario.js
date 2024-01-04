const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const {ehAdmin} = require(("../helpers/islogado"))


/*router.get("/",(req,res)=>{
    res.render("admin/index")
})
*/


router.get("/login",(req,res)=>{
    res.render("usuarios/login")
})

router.get("/registro",(req,res)=>{
    res.render("usuarios/usuario")
})

router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      
      req.flash("success_msg", "Deslogado com sucesso!")
      res.redirect('/');
    });
});

router.get("/",(req,res)=>{
    res.render("index/index")
})

router.get("/lista", (req,res)=>{

    Usuario.find({}).then((usuarios)=>{
        res.render("usuarios/lista", {usuarios: usuarios})
    }).catch((erro)=>{

    })

    
})

router.post("/", (req,res) =>{

    var erros = []

    if(!req.body.email ||  req.body.email == undefined || req.body.email == null){
        erros.push({ texto: "E-mail inválido!"})
    }

    if(!req.body.senha ||  req.body.senha == undefined || req.body.senha == null){
        erros.push({ texto: "Senha inválido!"})
    }

    if(erros.length > 0){
        res.render("usuarios/login",{erros:erros})
    }else{

        
        Usuario.findOne({email:req.body.email, senha:req.body.email}).then((usuario)=>{

            if(!usuario){
                req.flash("error_msg", "E-mail ou senha inválido!")
                res.redirect("/")
            }else{
                req.flash("success_msg", "Usuario cadastrado!")
                res.render("usuarios/login",{nome:usuario.nome})
            }

        }).catch((erro) =>{
            console.log("deu erro na consulta")
        })
    }
})



router.post("/usuario",(req,res)=>{ 

    var erros = []

    if(!req.body.nome ||  req.body.nome == undefined || req.body.nome == null){
        erros.push({ texto: "Nome inválido!"})
    }

    if(!req.body.email ||  req.body.email == undefined || req.body.email == null){
        erros.push({ texto: "E-mail inválido!"})
    }

    if(!req.body.senha ||  req.body.senha == undefined || req.body.senha == null){
        erros.push({ texto: "Senha inválido!"})
    }

    if(req.body.senha.length < 4){
        erros.push({ texto: "Senha muito curta!"})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({ texto: "As senhas são diferentes, tente novamente!"})
    }

    if(erros.length > 0){
        res.render("usuarios/usuario",{erros:erros})
    }else{
        Usuario.findOne({email:req.body.email}).then((usuario)=>{
            if(usuario){
                req.flash("error_msg", "Já existe um usuário cadastrado com esse e-mail!")
                res.redirect("/registro")
            }else{
               
                const novoUsuario = new Usuario({
                    nome : req.body.nome,
                    email : req.body.email,
                    senha : req.body.senha,
                })
                
                bcrypt.genSalt(10, (erro,salt)=>{
                    bcrypt.hash(novoUsuario.senha, salt, (erro,hash)=>{
                       
                        if(erro){
                            req.flash("error_msg",erro)
                            res.redirect("/registro")
                        }
                        
                        novoUsuario.senha = hash
                        novoUsuario.save().then(()=>{
                            req.flash("success_msg", "Usuario cadastrado!")
                            res.redirect("/registro")

                        }).catch((erro)=>{
                            res.redirect("/registro")
                            req.flash("error_msg","Erro na inclusão")
                        }) 
                    })
                })     
               
            }
        }).catch((err)=>{
            req.flash("erro_msg", "houve um erro interno!")
            res.redirect("usuarios/usuario")
        })
    }
})


router.post("/login", (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true

    })(req,res,next)
})

module.exports = router

module.exports = {
    isLogado: function(req,res,next){
        if(req.isAuthenticated() && req.user.ehAdmin == 'S'){
            return next()
        }

        req.flash("error_msg", "Voce deve ser administrador para acessar a pagina!")
        res.redirect("/")
    }
}
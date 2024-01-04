// Carrengando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const usuarios = require("./routes/usuario")
const path = require("path")
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
//const flash = require('express-flash')
const passport = require("passport")
require("./config/auth")(passport)
const db  = require("./config/db")

//Configurações
    //Sessão
        app.use(session({
            secret: "123",
            resave: true,
            saveUninitialized: true,
            cookie:{secure:false, maxAge:14400000}
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    //Middleware
        app.use((req,res, next) =>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null;
            next()
        })
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set('view engine','handlebars')
    //Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect(db.mongoURI).then(()=>{
            console.log("Conectado ao mongo!")
        }).catch((erro)=>{
            console.log("Erro ao se conectar:" + erro)
        })
    //Public
        app.use(express.static(path.join(__dirname,"public")))

//Rotas
    app.use('/',usuarios)
//Outros
const PORT = process.env.PORT || 8081
app.listen(PORT, ()=>{
    console.log("Servidor rodando!")
})
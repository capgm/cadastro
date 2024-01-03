
    if(process.env.NODE_ENV == "production"){
        module.exports = {mongoURI: "mongodb+srv://administrador:PpToDRCcPFzWV5vw@cluster0.1nutvnt.mongodb.net/?retryWrites=true&w=majority"}
    }else{
        module.exports = {mongoURI: "mongodb://localhost/cadastro"}
    }

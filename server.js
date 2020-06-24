const express  = require('express')
const nunjucks = require('nunjucks')
const routes   = require("./routes")

// cria o servidor e o executa
const server = express()

// configura para receber arquivos estáticos
server.use(express.static('public'))

//Usar o que foi obtido do arquivo routes
server.use(routes)

// configura a template engine
server.set("view engine", "njk")

//configura o nunjucks
nunjucks.configure("views", {
  express:server,
  autoescape: false,
  noCache: true
})

// inicializa o servidor
server.listen(5000, function(){
  console.log("server is running")
})
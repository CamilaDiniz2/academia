const express = require('express');
const nunjucks = require('nunjucks');
const routes = require('./routes');
const methodOverride = require('method-override');

// cria o servidor e o executa
const server = express();

// faz funcionar o req.body
server.use(express.urlencoded({ extended: true }));
// configura para receber arquivos estáticos
server.use(express.static('public'));
// usa o methodOverride -> uso do delete e put no formulário
server.use(methodOverride('_method'));
//Usar o que foi obtido do arquivo routes
server.use(routes);

// configura a template engine
server.set('view engine', 'njk');

//configura o nunjucks
nunjucks.configure('views', {
  express: server,
  autoescape: false,
  noCache: true,
});

// inicializa o servidor
server.listen(5000, function () {
  console.log('server is running');
});

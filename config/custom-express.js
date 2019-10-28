var express = require('express');
var consign = require('consign'); // O consign é a biblioteca que lê os diretórios e arquivos os disponibilizando para o express
var bodyParser = require('body-parser'); // Converte JSON(String) em objeto
var expressValidator = require('express-validator');

module.exports = function() {
    var app = express();

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    // Obrigatoriamente logo apos o bodyParser
    app.use(expressValidator());

    consign()
     .include('controllers')
     .then('persistencia')
     .into(app);

    return app;
}
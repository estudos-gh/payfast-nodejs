var app = require('./config/custom-express')(); // O require copia o conteúdo do arquivo. É preciso do () para invocar a função


// var pagamentos = require('./controllers/pagamentos');
// pagamentos(app);

app.listen(3000, function(){
    console.log('Servidor rodando na porta 3000');
});


module.exports = function(app) {
    app.get('/pagamentos', function(req, res){
        console.log('Recebida requisição de teste');
        res.send('Teste ok!');
    });

    app.post('/pagamentos/pagamento', function(req, res){

        req.assert("forma_de_pagamento", "Forma de pagamento é obrigatório").notEmpty();
        req.assert("valor", "Valor é obrigatório e deve ser um decimal").notEmpty().isFloat();
        req.assert("moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3,3);

        var erros = req.validationErrors();
        if(erros) {
            console.log('Erros de validação encontrados');
            res.status(400).json(erros);
            return; //Sempre que faz um res.send a resposta já foi dada e não pode ser sobrescrita. Portanto é obrigatório matar a função neste ponto; 
        }

        var pagamento = req.body;
        console.log('processando requisição de um novo pagamento');

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamento.status = 'CRIADO';
        pagamento.data = new Date;

        pagamentoDao.salva(pagamento, function(erro, result) {
            if(erro) {
                res.status(500).json(erro);
                console.log(erro);
            } else {
                res.location('/pagamentos/pagamento/'+result.insertId); // Informa que uma nova página foi criada
                pagamento.id = result.insertId;
                res.status(201).json(pagamento);
            }
        });
    });
}
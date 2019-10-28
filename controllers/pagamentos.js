module.exports = function(app) {
    app.get('/pagamentos', function(req, res) {
        console.log('Recebida requisição de teste');
        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.lista(function(erro, result){
            if (erro) {
                return res.status(500).send(erro);
            }
            
            return res.json(result);
        });
    });

    app.get('/pagamentos/pagamento/:id', function(req, res) {
        var id = req.params.id;
        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.buscaPorId(id, function(erro, result){
            if (erro) {
                return res.status(500).send(erro);
            }
            return res.json(result);
        });
    });

    app.delete('/pagamentos/pagamento/:id', function(req, res) {
        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'CANCELADO';

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function(erro){
            if (erro) {
                return res.status(500).send(erro);
            }
            console.log('pagamento cancelado');
            return res.status(204).send(pagamento);
        })
    });

    app.put('/pagamentos/pagamento/:id', function(req, res) {
        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'CONFIRMADO';
        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function(erro) {
            if (erro) {
                res.status(500).send(erro);
                return ;
            }
            console.log('Pagamento confirmado');
            res.send(pagamento);
        });
    });

    app.post('/pagamentos/pagamento', function(req, res){

        req.assert("forma_de_pagamento", "Forma de pagamento é obrigatório").notEmpty();
        req.assert("valor", "Valor é obrigatório e deve ser um decimal").notEmpty().isFloat();
        req.assert("moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3,3);

        var erros = req.validationErrors();
        if(erros) {
            console.log('Erros de validação encontrados');
            return res.status(400).json(erros); // Sempre que faz um res.send a resposta já foi dada e não pode ser sobrescrita. Portanto é obrigatório matar a função neste ponto; 
        }

        var pagamento = req.body;
        console.log('processando requisição de um novo pagamento');

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamento.status = 'CRIADO';
        pagamento.data = new Date;

        pagamentoDao.salva(pagamento, function(erro, result) {
            if(erro) {
                console.log(erro);
                return res.status(500).json(erro);
            } else {
                res.location('/pagamentos/pagamento/'+result.insertId); // Informa que uma nova página foi criada
                pagamento.id = result.insertId;

                // hateoas: Informar para o cliente da API quais funções é possível ser feito com o dado adicionado
                // Hypermedia As The Engine Of Application State
                var response = {
                    dados_do_pagamento: pagamento,
                    links: [
                        {
                            href: "http://localhost:3000/pagamentos/pagamento/"
                                + pagamento.id,
                            rel: "Confirmar pagamento",
                            method: "PUT" 
                        },
                        {
                            href: "http://localhost:3000/pagamentos/pagamento/"
                                + pagamento.id,
                            rel: "Cancelar pagamento",
                            method: "DELETE"
                        }
                    ]
                }

                return res.status(201).json(response);
            }
        });
    });
}
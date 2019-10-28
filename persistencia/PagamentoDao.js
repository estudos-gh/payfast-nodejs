function PagamentoDao(connection) {
    this._connection = connection;
}

// Como estamos colocando os métodos dentro de uma função, trabalhamos com o prototype
PagamentoDao.prototype.salva = function(pagamento, callback) {
    this._connection.query('INSERT INTO pagamentos SET ?', pagamento, callback);
}

PagamentoDao.prototype.atualiza = function(pagamento, callback) {
    this._connection.query('UPDATE pagamentos SET status = ? where id = ?', [pagamento.status, pagamento.id], callback);
}

PagamentoDao.prototype.lista = function(callback) {
    this._connection.query('SELECT * FROM pagamentos', callback);
}

PagamentoDao.prototype.buscaPorId = function(id, callback) {
    this._connection.query('SELECT * FROM pagamentos WHERE id=?', [id], callback);
}

module.exports = function(){
    return PagamentoDao;
}

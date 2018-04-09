"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NegociacaoService = function () {
    function NegociacaoService() {
        _classCallCheck(this, NegociacaoService);

        this._http = new HttpService();
    }

    _createClass(NegociacaoService, [{
        key: "lista",
        value: function lista() {
            return new Promise(function (resolve, reject) {
                ConnectionFactory.getConnection().then(function (cnn) {
                    return new NegociacaoDao(cnn);
                }).then(function (dao) {
                    return dao.listaTodos();
                }).then(function (lista) {
                    return resolve(lista);
                }).catch(function (err) {
                    return reject(err);
                });
            });
        }
    }, {
        key: "obterNegociacoes",
        value: function obterNegociacoes() {
            var _this = this;

            return new Promise(function (resolve, reject) {

                var all = Promise.all([_this.obterNegociacoesDaSemana(), _this.obterNegociacoesDaSemanaAnterior(), _this.obterNegociacoesDaSemanaRetrasada()]).then(function (negociacoes) {

                    var all = negociacoes.reduce(function (flatArray, array) {
                        return flatArray.concat(array);
                    }, []);
                    console.log("lista filtrada =>", all);
                    resolve(all);
                }).catch(function (err) {
                    return reject(err);
                });
            });
        }
    }, {
        key: "importa",
        value: function importa(listaAtual) {
            return this.obterNegociacoes().then(function (lista) {

                var listaFiltrada = lista.filter(function (n) {
                    return !listaAtual.some(function (nExistente) {
                        return n.isEquals(nExistente);
                    });
                });
                console.log(listaFiltrada);
                return listaFiltrada;
            }).catch(function (err) {
                console.log(err);
                throw new Error("Não foi possível imporar as neogociações");
            });
        }
    }, {
        key: "cadastra",
        value: function cadastra(negociacao) {

            return new Promise(function (resolve, reject) {
                ConnectionFactory.getConnection().then(function (cnn) {

                    new NegociacaoDao(cnn).adiciona(negociacao).then(function () {
                        resolve(negociacao);
                    }).catch(function (err) {
                        console.log(err);
                        reject(err);
                    });
                }).catch(function (err) {
                    console.log(err);
                    reject(err);
                });
            });
        }
    }, {
        key: "apagaTodos",
        value: function apagaTodos() {
            return new Promise(function (resolve, reject) {
                ConnectionFactory.getConnection().then(function (cnn) {
                    return new NegociacaoDao(cnn);
                }).then(function (dao) {
                    return dao.apagaTodos();
                }).then(function () {
                    resolve();
                }).catch(function (err) {
                    console.log(err);
                    reject(err);
                });
            });
        }
    }, {
        key: "_obterNegociacoes",
        value: function _obterNegociacoes(endpont) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {

                _this2._http.get(endpont).then(function (negociacoes) {
                    var result = negociacoes.map(function (obj) {
                        return new Negociacao(new Date(obj.data), obj.quantidade, obj.valor);
                    });
                    resolve(result);
                }).catch(function (error) {
                    console.log(xhr.responseText);
                    reject("Não foi possível obter negociações da semana");
                });
            });
        }
    }, {
        key: "adiciona",
        value: function adiciona(negociacao) {
            return this._http.post('/negociacoes', negociacao);
        }
    }, {
        key: "obterNegociacoesDaSemana",
        value: function obterNegociacoesDaSemana(cb) {
            return this._obterNegociacoes('negociacoes/semana');
        }
    }, {
        key: "obterNegociacoesDaSemanaAnterior",
        value: function obterNegociacoesDaSemanaAnterior(cb) {
            return this._obterNegociacoes('negociacoes/anterior', cb);
        }
    }, {
        key: "obterNegociacoesDaSemanaRetrasada",
        value: function obterNegociacoesDaSemanaRetrasada(cb) {
            return this._obterNegociacoes('negociacoes/retrasada', cb);
        }
    }]);

    return NegociacaoService;
}();
//# sourceMappingURL=NegociacoesService.js.map
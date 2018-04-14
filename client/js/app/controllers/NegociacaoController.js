'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ListaNegociacoes = require('../models/ListaNegociacoes');

var _Mensagem = require('../models/Mensagem');

var _NegociacaoView = require('../views/NegociacaoView');

var _MensagemView = require('../views/MensagemView');

var _NegociacaoService = require('../services/NegociacaoService');

var _DateHelper = require('../helpers/DateHelper');

var _Bind = require('../helpers/Bind');

var _Negociacao = require('../models/Negociacao');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NegociacaoController = function () {
	function NegociacaoController() {
		_classCallCheck(this, NegociacaoController);

		var $ = document.querySelector.bind(document);
		this._inputData = $('#data');
		this._inputQuantidade = $('#quantidade');
		this._inputValor = $('#valor');

		this._listaNegociacoes = new _Bind.Bind(new _ListaNegociacoes.ListaNegociacoes(), new NegociacoesView($('#negociacoesView')), 'adiciona', 'esvazia', 'ordena', 'inverte');
		this._mensagem = new _Bind.Bind(new _Mensagem.Mensagem(), new _MensagemView.MensagemView($('#mensagemView')), "texto");
		this._ordemAtual = '';
		this._service = new _NegociacaoService.NegociacaoService();
		this._init();
	}

	_createClass(NegociacaoController, [{
		key: '_init',
		value: function _init() {
			var _this = this;

			this._service.lista().then(function (lista) {
				return lista.forEach(function (n) {
					return _this._listaNegociacoes.adiciona(n);
				});
			}).catch(function (err) {
				return _this._mensagem.texto = "Erro ao obter necogiações!!";
			});
			this._agendaImportacao(5000);
		}
	}, {
		key: '_agendaImportacao',
		value: function _agendaImportacao(intervalo) {
			var _this2 = this;

			setInterval(function () {
				_this2.importaNegociacoes();
				// this._agendaImportacao(intervalo);
			}, intervalo);
		}
	}, {
		key: 'adiciona',
		value: function adiciona(event) {
			var _this3 = this;

			event.preventDefault();
			var negociacao = this._criaNegociacao();

			this._service.cadastra(this._criaNegociacao()).then(function () {
				_this3._listaNegociacoes.adiciona(negociacao);
				_this3._limpaFormulario();
				_this3._mensagem.texto = "Negociação adicionada com sucesso";
			}).catch(function (e) {
				console.log(e);
				_this3._mensagem.texto = "Houve um erro ao cadastrar";
			});

			// let dao = NegociacaoDao(con)


			// let service = new NegociacaoService();
			// try{
			//     let negociacao = this._criaNegociacao()
			//     let dto = {
			//         data: DateHelper.dataParaTexto(negociacao.data),
			//             quantidade:  negociacao.quantidade,
			//             valor: negociacao.valor
			//     }

			//      service.adiciona(dto).then(()=>
			//      {
			//         this._listaNegociacoes.adiciona(negociacao);             
			//         this._mensagem.texto = 'Negociação adicionada com sucesso';
			//      }).catch((error)=>this._mensagem.texto = "Houve um erro no servidor");

			// } catch(erro){
			//     this._mensagem.texto = erro;
			// }

		}
	}, {
		key: 'ordena',
		value: function ordena(coluna) {
			if (coluna == this._ordemAtual) {
				this._listaNegociacoes.inverte();
			} else {
				this._listaNegociacoes.ordena(function (a, b) {
					return a[coluna] - b[coluna];
				});
			}
			this._ordemAtual = coluna;
		}
	}, {
		key: 'apaga',
		value: function apaga() {
			var _this4 = this;

			this._service.apagaTodos().then(function () {
				_this4._listaNegociacoes.esvazia();
				_this4._mensagem.texto = "Dados Apagados com sucesso";
			}).catch(function (err) {
				return _this4._mensagem.texto = err;
			});
		}
	}, {
		key: 'importaNegociacoes',
		value: function importaNegociacoes(cb) {
			var _this5 = this;

			this._service.importa(this._listaNegociacoes.negociacoes).then(function (lista) {
				console.log(lista);
				lista.forEach(function (n) {
					return _this5._listaNegociacoes.adiciona(n);
				});
			}).then(function () {
				return _this5._mensagem.texto = "Dados importados com sucesso!";
			}).catch(function (err) {
				return _this5._mensagem.texto = err;
			});
			/* 
   		Promise.all([
   			this._service.obterNegociacoesDaSemana(),
   			this._service.obterNegociacoesDaSemanaAnterior(),
   			this._service.obterNegociacoesDaSemanaRetrasada()
   		]).then(negociacoes => {
   			negociacoes.reduce(
   				(flatArray, array) => flatArray.concat(array), [])
   				.filter(n=> !this._listaNegociacoes.contains(n))
   				.forEach(n => this._listaNegociacoes.adiciona(n))
   			this._mensagem.texto = "Negociações Obtidas com Sucesso!!";
   		})
   			.catch((error) => this._mensagem.texto(error)); */
			/*
         service.obterNegociacoesDaSemana((error, negociacoes) => {
             if (error) {
                 this._mensagem.texto = "Não foi possível obter as negociações ";
                 return;
              }
             negociacoes.forEach((n) => this._listaNegociacoes.adiciona(n));
             this._mensagem.texto = "Negociações obtidas com sucesso!! ";
             service.obterNegociacoesDaSemanaAnterior((error, negociacoes) => {
                 if (error) {
                     this._mensagem.texto = "Não foi possível obter as negociações ";
                     return;
     
                 }
                 negociacoes.forEach((n) => this._listaNegociacoes.adiciona(n));
                 this._mensagem.texto = "Negociações obtidas com sucesso!! ";
                 service.obterNegociacoesDaSemanaRetrasada((error, negociacoes) => {
                     if (error) {
                         this._mensagem.texto = "Não foi possível obter as negociações ";
                         return;
         
                     }
                     negociacoes.forEach((n) => this._listaNegociacoes.adiciona(n));
                     this._mensagem.texto = "Negociações obtidas com sucesso!! ";        
                 })
     
             })
          })
         */
		}
	}, {
		key: '_criaNegociacao',
		value: function _criaNegociacao() {

			return new _Negociacao.Negociacao(_DateHelper.DateHelper.textoParaData(this._inputData.value), parseFloat(this._inputQuantidade.value), parseFloat(this._inputValor.value));
		}
	}, {
		key: '_limpaFormulario',
		value: function _limpaFormulario() {

			this._inputData.value = '';
			this._inputQuantidade.value = 1;
			this._inputValor.value = 0.0;
			this._inputData.focus();
		}
	}]);

	return NegociacaoController;
}();
//# sourceMappingURL=NegociacaoController.js.map
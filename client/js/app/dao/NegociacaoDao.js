'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NegociacaoDao = function () {
	function NegociacaoDao(connection) {
		_classCallCheck(this, NegociacaoDao);

		this._conection = connection;
		this._store = 'negociacoes';
	}

	_createClass(NegociacaoDao, [{
		key: 'adiciona',
		value: function adiciona(negociacao) {
			var _this = this;

			return new Promise(function (resolve, reject) {
				var request = _this._conection.transaction([_this._store], 'readwrite').objectStore(_this._store).add(negociacao);

				request.onsuccess = function () {
					return resolve();
				};
				request.onerror = function (e) {
					console.log(e.target.error);
					reject("Ocorreu um erro ");
				};
			});
		}
	}, {
		key: 'apagaTodos',
		value: function apagaTodos() {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				var request = _this2._conection.transaction([_this2._store], 'readwrite').objectStore(_this2._store).clear();
				request.onerror = function (e) {
					console.log(e);
					reject('Ocorreu um erro ao limpar a tabela');
				};
				request.onsuccess = function (e) {
					return resolve();
				};
			});
		}
	}, {
		key: 'listaTodos',
		value: function listaTodos() {
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				var cursor = _this3._conection.transaction([_this3._store], 'readwrite').objectStore(_this3._store).openCursor();
				cursor.onerror = function (e) {
					return reject(e);
				};
				var negociacoes = [];
				cursor.onsuccess = function (e) {
					var atual = e.target.result;
					if (atual) {
						var dado = atual.value;
						negociacoes.push(new Negociacao(dado._data, dado._quantidade, dado._valor));
						atual.continue();
					} else {
						resolve(negociacoes);
					}
				};
			});
		}
	}]);

	return NegociacaoDao;
}();
//# sourceMappingURL=NegociacaoDao.js.map
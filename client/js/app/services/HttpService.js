"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HttpService = function () {
	function HttpService() {
		_classCallCheck(this, HttpService);
	}

	_createClass(HttpService, [{
		key: "_doRequest",
		value: function _doRequest(url, method, data) {

			return new Promise(function (resolve, reject) {

				var xhr = new XMLHttpRequest();
				xhr.open(method, url);
				if (data) {
					xhr.setRequestHeader("Content-Type", "application/json");
				}
				//configurações
				//0 requisicao não iniciada
				//1 conexão com servidor estabelecida
				//2 requisição recebida
				//3 processando requisição
				//4 reuisição concluida e a resposta está pronta

				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {

						if (xhr.status == 200) {

							console.log("Negociaçõe obtidas com sucesso");
							resolve(JSON.parse(xhr.responseText));
						} else {
							console.log(xhr.responseText);
							reject(xhr.responseText);
						}
					}
				};
				if (data) {
					xhr.send(JSON.stringify(data));
				} else {
					xhr.send();
				}
			});
		}
	}, {
		key: "post",
		value: function post(url, data) {
			var _this = this;

			return fetch(url, {
				haeders: { 'Content-type': 'application/json' },
				method: 'POST',
				body: JSON.stringify(data)
			}).then(function (res) {
				return _this._handleError(res);
			}).then(function (res) {
				return res.json();
			});
			//return this._doRequest(url, "POST", data);
		}
	}, {
		key: "_handleError",
		value: function _handleError(res) {
			if (!res.ok) {
				throw new Error(res.statuText);
			}
			return res;
		}
	}, {
		key: "get",
		value: function get(url) {
			var _this2 = this;

			return fetch(url).then(function (res) {
				return _this2._handleError(res);
			}).then(function (res) {
				return res.json();
			});
		}
	}]);

	return HttpService;
}();
//# sourceMappingURL=HttpService.js.map
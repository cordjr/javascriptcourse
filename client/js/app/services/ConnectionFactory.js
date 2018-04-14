'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var stores = ['negociacoes'];
var VERSION = 4;
var dbName = 'aluraframe';
var connection = null;
var close = null;

var ConnectionFactory = exports.ConnectionFactory = function () {
	function ConnectionFactory() {
		_classCallCheck(this, ConnectionFactory);

		throw new Error('Não é possivel instnciar');
	}

	_createClass(ConnectionFactory, null, [{
		key: '_createStores',
		value: function _createStores(cnn) {

			stores.forEach(function (name) {

				if (cnn.objectStoreNames.contains(name)) {
					cnn.deleteObjectStore(name);
				}
				cnn.createObjectStore(name, { autoIncrement: true });
			});
		}
	}, {
		key: 'closeConnection',
		value: function closeConnection() {
			if (connection) {
				close();
				connection = null;
			}
		}
	}, {
		key: 'getConnection',
		value: function getConnection() {

			return new Promise(function (resolve, reject) {

				var openRequest = window.indexedDB.open(dbName, VERSION);
				openRequest.onupgradeneeded = function (e) {
					if (!connection) {
						connection = e.target.result;
					}

					ConnectionFactory._createStores(connection);
				};
				openRequest.onerror = function (e) {
					console.log(e.target.error);
					reject(e.target.error.name);
				};
				openRequest.onsuccess = function (e) {
					if (!connection) {
						connection = e.target.result;
						close = connection.close.bind(connection);
						connection.close = function () {
							throw new Error('You cannot close connnectin throgh this method');
						};
					}

					resolve(connection);
				};
			});
		}
	}]);

	return ConnectionFactory;
}();
//# sourceMappingURL=ConnectionFactory.js.map




const stores = ['negociacoes']
const VERSION = 4
const dbName = 'aluraframe'
var connection = null
var close = null
export class ConnectionFactory {

	constructor() {
		throw new Error('Não é possivel instnciar')
	}

	static _createStores(cnn) {

		stores.forEach(name => {

			if (cnn.objectStoreNames.contains(name)) {
				cnn.deleteObjectStore(name)

			}
			cnn.createObjectStore(name, { autoIncrement: true })

		})



	}
	static closeConnection() {
		if (connection) {
			close()
			connection = null
		}
	}

	static getConnection() {

		return new Promise((resolve, reject) => {

			let openRequest = window.indexedDB.open(dbName, VERSION)
			openRequest.onupgradeneeded = (e) => {
				if (!connection) {
					connection = e.target.result
				}

				ConnectionFactory._createStores(connection)
			}
			openRequest.onerror = (e) => {
				console.log(e.target.error)
				reject(e.target.error.name)

			}
			openRequest.onsuccess = (e) => {
				if (!connection) {
					connection = e.target.result
					close = connection.close.bind(connection)
					connection.close = function () {
						throw new Error('You cannot close connnectin throgh this method')
					};
				}

				resolve(connection)

			}

		})

	}

}

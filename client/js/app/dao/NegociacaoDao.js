class NegociacaoDao {
	constructor(connection) {
		this._conection = connection
		this._store = 'negociacoes'
	}
	adiciona(negociacao) {
		return new Promise((resolve, reject) => {
			let request = this._conection.
				transaction([this._store], 'readwrite')
				.objectStore(this._store)
				.add(negociacao)


			request.onsuccess = ()=> resolve()
			request.onerror = e => {
				console.log(e.target.error)
				reject("Ocorreu um erro ")
			}
		});
	}

	apagaTodos(){
		return new Promise((resolve, reject)=>{
			let request = this._conection.
				transaction([this._store], 'readwrite')
				.objectStore(this._store)
				.clear();
			request.onerror = e =>{
				console.log(e);
				reject('Ocorreu um erro ao limpar a tabela');
			}
			request.onsuccess = e=> resolve();

		});
	}

	listaTodos() {
		return new Promise((resolve, reject) => {
			let cursor = this._conection.
				transaction([this._store], 'readwrite')
				.objectStore(this._store)
				.openCursor();
			cursor.onerror = e => reject(e);
			let negociacoes = [];
			cursor.onsuccess = (e => {
				let atual = e.target.result;
				if (atual) {
					var dado = atual.value;
					negociacoes.push(new Negociacao(dado._data, dado._quantidade, dado._valor));
					atual.continue();

				} else{
					resolve(negociacoes);
				}


			});

		});
	}
}
class NegociacaoService {
    constructor() {
        this._http = new HttpService();
    }

    cadastrar(negociacao){

        return new Promise((resolve, reject)=>{
            ConnectionFactory.getConnection().then(cnn => {
                let negociacao = this._criaNegociacao()
                new NegociacaoDao(cnn)
                    .adiciona(negociacao)
                    .then(() => {
                        resolve(negociacao)
                    }).catch(err => {
                        console.log(err)
                        reject(err)
                    });
    
            }).catch(err => {
                console.log(err);
                reject(err);
            });

        });

    }


    _obterNegociacoes(endpont) {



        return new Promise((resolve, reject) => {

            this._http.get(endpont)
                .then(negociacoes => {
                    let result = negociacoes.map((obj) => new Negociacao(new Date(obj.data), obj.quantidade, obj.valor));
                    resolve(result);
                })
                .catch(error => {
                    console.log(xhr.responseText)
                    reject("Não foi possível obter negociações da semana");

                });
            })

    }
    adiciona(negociacao){
        return this._http.post('/negociacoes', negociacao);
    }

    obterNegociacoesDaSemana(cb) {
        return this._obterNegociacoes('negociacoes/semana');
    }

    obterNegociacoesDaSemanaAnterior(cb) {
        return this._obterNegociacoes('negociacoes/anterior', cb);
    }

    obterNegociacoesDaSemanaRetrasada(cb) {
        return this._obterNegociacoes('negociacoes/retrasada', cb);
    }



}
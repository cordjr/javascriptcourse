class NegociacaoController {

	constructor() {

		let $ = document.querySelector.bind(document);
		this._inputData = $('#data');
		this._inputQuantidade = $('#quantidade');
		this._inputValor = $('#valor');

		this._listaNegociacoes = new Bind(new ListaNegociacoes(), new NegociacoesView($('#negociacoesView')),
			'adiciona', 'esvazia', 'ordena', 'inverte');
		this._mensagem = new Bind(new Mensagem(), new MensagemView($('#mensagemView')), "texto");
		this._ordemAtual = '';
		this._init()

		



	}

	_init(){
		ConnectionFactory.getConnection()
			.then(cnn => new NegociacaoDao(cnn))
			.then(dao => dao.listaTodos())
			.then(lista => lista.forEach(n => this._listaNegociacoes.adiciona(n)))
			.catch(err => this._mensagem.texto = err);
		this._agendaImportacao(5000);

	}

	_agendaImportacao(intervalo){
		setInterval(()=>{
			this.importaNegociacoes();
			// this._agendaImportacao(intervalo);

		}, intervalo);

	}

	adiciona(event) {
		event.preventDefault();
		let negociacao = this._criaNegociacao();

		new NegociacaoService()
			.cadastra(this._criaNegociacao())
			.then(()=>{
				this._listaNegociacoes.adiciona(negociacao);
				this._limpaFormulario();
				this._mensagem.texto = "Negociação adicionada com sucesso"
			}).catch(e=>{
				console.log(e);
				this._mensagem.texto = "Houve um erro ao cadastrar";

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
	ordena(coluna) {
		if (coluna == this._ordemAtual) {
			this._listaNegociacoes.inverte();

		} else {
			this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
		}
		this._ordemAtual = coluna;

	}

	apaga() {

		ConnectionFactory.getConnection()
			.then(cnn => new NegociacaoDao(cnn))
			.then(dao => dao.apagaTodos())
			.then(() => {
				this._listaNegociacoes.esvazia();
				this._mensagem.texto = "Dados Apagados com sucesso";
			})
			.catch(err => this._mensagem.texto = err);

	}

	importaNegociacoes(cb) {
		let service = new NegociacaoService();

		Promise.all([
			service.obterNegociacoesDaSemana(),
			service.obterNegociacoesDaSemanaAnterior(),
			service.obterNegociacoesDaSemanaRetrasada()
		]).then(negociacoes => {
			negociacoes.reduce(
				(flatArray, array) => flatArray.concat(array), [])
				.filter(n=> !this._listaNegociacoes.contains(n))
				.forEach(n => this._listaNegociacoes.adiciona(n))
			this._mensagem.texto = "Negociações Obtidas com Sucesso!!";
		})
			.catch((error) => this._mensagem.texto(error));
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

	_criaNegociacao() {

		return new Negociacao(
			DateHelper.textoParaData(this._inputData.value),
			parseFloat(this._inputQuantidade.value),
			parseFloat(this._inputValor.value));
	}

	_limpaFormulario() {

		this._inputData.value = '';
		this._inputQuantidade.value = 1;
		this._inputValor.value = 0.0;
		this._inputData.focus();
	}
}
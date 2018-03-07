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
    }

    adiciona(event) {

        event.preventDefault();
        this._listaNegociacoes.adiciona(this._criaNegociacao());

        this._mensagem.texto = 'Negociação adicionada com sucesso';


        this._limpaFormulario();
    }
    ordena(coluna){
        if (coluna == this._ordemAtual){
            this._listaNegociacoes.inverte();

        } else {
            this._listaNegociacoes.ordena((a, b)=> a[coluna] - b[coluna]);
        }
        this._ordemAtual = coluna;
        
    }

    apaga() {

        this._listaNegociacoes.esvazia();

        this._mensagem.texto = 'Negociações apagadas com sucesso';

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
            this._inputQuantidade.value,
            this._inputValor.value);
    }

    _limpaFormulario() {

        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();
    }
}
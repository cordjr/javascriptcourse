class ListaNegociacoes {

    constructor() {
        
        this._negociacoes = [];
        
    }

    adiciona(negociacao) {
        
        this._negociacoes.push(negociacao);
    }

    ordena(criterio){
        this._negociacoes.sort(criterio);
    }
    
    inverte(){
        this._negociacoes.reverse();
    }

    get negociacoes() {
        
        return [].concat(this._negociacoes);
    }

    esvazia() {
        
        this._negociacoes = [];
    }

    contains(negociaccao){
        return this._negociacoes.some((n)=> n.equals(negociaccao));
    }

    get volumeTotal(){
        return this._negociacoes.reduce((total, n) => total + n.volume, 0.0)
    }
}
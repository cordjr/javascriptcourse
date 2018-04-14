import { HttpService } from '../services/HttpService';
import { NegociacaoDao } from '../dao/NegociacaoDao';
import { Negociacao } from '../models/Negociacao';
import { ConnectionFactory } from './ConnectionFactory';
export class NegociacaoService {
    constructor() {
        this._http = new HttpService();
    }

    lista() {
        return new Promise((resolve, reject) => {
            ConnectionFactory.getConnection()
                .then(cnn => new NegociacaoDao(cnn))
                .then(dao => dao.listaTodos())
                .then(lista => resolve(lista))
                .catch(err => reject(err));

        });



    }
    obterNegociacoes() {
        return new Promise((resolve, reject) => {

            let all = Promise.all([
                this.obterNegociacoesDaSemana(),
                this.obterNegociacoesDaSemanaAnterior(),
                this.obterNegociacoesDaSemanaRetrasada()
            ]).then(negociacoes => {

                let all = negociacoes.reduce(
                    (flatArray, array) => flatArray.concat(array), [])
                console.log("lista filtrada =>", all);
                resolve(all);



            }).catch(err => reject(err));



        })


    }
    importa(listaAtual) {
        return this.obterNegociacoes().then(

            (lista) => {

                let listaFiltrada = lista
                    .filter(n => !listaAtual
                        .some(nExistente => n.isEquals(nExistente))
                    )
                console.log(listaFiltrada)
                return listaFiltrada;
            }
        )
            .catch(err => {
                console.log(err);
                throw new Error("Não foi possível imporar as neogociações");
            })
    }



    cadastra(negociacao) {

        return new Promise((resolve, reject) => {
            ConnectionFactory.getConnection().then(cnn => {

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

    apagaTodos() {
        return new Promise((resolve, reject) => {
            ConnectionFactory.getConnection()
                .then(cnn => new NegociacaoDao(cnn))
                .then(dao => dao.apagaTodos())
                .then(() => {
                    resolve();
                })
                .catch(err => {
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




    adiciona(negociacao) {
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
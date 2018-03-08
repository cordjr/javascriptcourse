class HttpService {





    _doRequest(url, method, data){
        

        return new Promise((resolve, reject) => {


            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            if (data){
                xhr.setRequestHeader("Content-Type", "application/json");
            }
            //configurações
            //0 requisicao não iniciada
            //1 conexão com servidor estabelecida
            //2 requisição recebida
            //3 processando requisição
            //4 reuisição concluida e a resposta está pronta

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {


                    if (xhr.status == 200) {

                        console.log("Negociaçõe obtidas com sucesso");
                        resolve(JSON.parse(xhr.responseText));                        

                    } else {
                        console.log(xhr.responseText)
                        reject(xhr.responseText);
                    }

                }

            }
            if (data){
                xhr.send(JSON.stringify(data))
            } else {
                xhr.send();
            }
            

        });

    }


    post(url, data){
        return this._doRequest(url, "POST", data);
    }

    
    get(url){
        return this._doRequest(url,"GET")
    }
}
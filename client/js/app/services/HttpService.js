class HttpService {

    
    get(url){
        return new Promise((resolve, reject) => {


            let xhr = new XMLHttpRequest();
            xhr.open('GET', url);
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
            xhr.send();

        });
    }
}
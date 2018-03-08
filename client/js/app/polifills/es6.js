if (!Array.prototype.includes){
    console.log("plifil adicionado ");
    Array.prototype.includes = function(elemento){
        return this.indexOf(elemento) != -1;
    }

}
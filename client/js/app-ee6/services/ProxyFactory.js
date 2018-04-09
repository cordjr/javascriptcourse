class ProxyFactory{


	static create(objeto, props, action){

		return new Proxy(objeto, {
            
			get(target, prop, receiver) {
                
				if(props.includes(prop) && ProxyFactory._isFunction(target[prop])) {
                    
					return function() {
                        
						console.log(`interceptando ${prop}`);
						Reflect.apply(target[prop], target, arguments);
						return action(target);;
					}
				}
                
				return Reflect.get(target, prop, receiver);
			},
			set(target, prop, value, receiver ){
				let result = Reflect.set(target, prop, value, receiver);
				if (props.includes(prop)){
					console.log(`interceptando ${prop}`);
					console.log(action);
					action(target);
				}
				return result;

                
			}
            
		});

	}

	static _isFunction(func){
		return (typeof(func) == typeof(Function));
	}

}
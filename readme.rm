# angular-apiservice

## Instalación para desarrollo:
```sh
$ npm install
$ gulp install
$ grunt build
```

## Instalación como librería:

```javascript
// Añadir a bower.json o package.json
"angular-apiservice": "https://github.com/atmira-it/angular-apiservice.git"

// Incluir la dependencia en el módulo principal de la aplicación
angular.module('app', ['ApiService']);

// Configurar la factoría con los diferentes puntos de origen (+ info adelante)
angular.module('app')
	.config(['apiServiceConfProvider', function(apiServiceConfProvider) {
		apiServiceConfProvider.config(puntosDeOrigen, flagUsarMocks);
	}]);
```

## API:
### apiServiceConfProvider.config([origins], mockFlag);
Configura los puntos de origen de los distintos servicios REST.

| Parametro | Tipo                                       | Descripción |
| --------- | ------------------------------------------ | ----------- |
| origins   | `Object.<Object>=`                         | Hash con la declaración de los diferentes APIs a los que se van a acceder y su ruta. |
| mockFlag  | `Boolean` <sub><sup>(Opcional)</sup></sub> | Indica si han de usarse mocks, sustituyendo las llamadas. Por defecto: false. |

```javascript
// EJEMPLO
var flagUsarMocks = true;
var puntosDeOrigen = {
	webflow: '/api/1.0/subprocesos/',
	tabit: 'https://xxx.xx.xx.xx:xxxx/tabit/api/1.0/'
}
angular.module('app')
	.config(['apiServiceConfProvider', function(apiServiceConfProvider) {
		apiServiceConfProvider.config(puntosDeOrigen, flagUsarMocks);
	}]);
```
### ApiService.*origin*(endPoint, [defaultParams], [customActions]);
Devuelve un objeto con métodos configurados para operar sobre el servicio REST indicado.

| Parametro       | Tipo               | Descripción |
| --------------- | ------------------------ | ----------- |
| endPoint        | `String`           | Ruta final del servicio REST. Se concatena a la url provista en la configuración del *origin* |
| [defaultParams] | `Object.<Object>=` | Parámetros por defecto en la ruta. No confundir con los parametros de la cabecera |
| [customActions] | `Object.<Object>=` | Crea acciones personalizadas a parte de GET, QUERY, DELETE... [Mas info](https://docs.angularjs.org/api/ngResource/service/$resource#usage) |

```javascript
// EJEMPLO
angular.module('app', ['ApiService'])
	.service('AccountsService', function(ApiService) {
		var service = {};
		var account = ApiService.webflow('accounts/:id/');
		service.getAccount = function(id){
			return account.get({id: id});
		}
		return service;
 });
```

### Operaciones del objeto *Origin*
Tras configurar un Origin con el método anterior, este devuelve un objeto con diferentes métodos públicos para operar sobre el servicio REST configurado.
Estos métodos son las acciones comunes GET, QUERY, CREATE, DELETE, junto a las añadidas cuando se configuró el Origin.

| Parametro    | Tipo               | Descripción |
| ------------ | ------------------ | ----------- |
| [parameters] | `Object.<Object>=` | Parámetros a incluir en la URL de la petición. En caso de estar definidos en la url, se sustituirá la `:clave` por el valor. En caso contrario se incluirá al final de la ruta con el formato `?clave=valor&clave=valor&...` |
| [postData]   | `Object.<Object>=` | Parámetros a incluir en los datos de la cabecera. Se trasforman a JSON para su envío. |
| success      | `Function`         | Callback en caso de que la petición tenga éxito. [Mas info](https://docs.angularjs.org/api/ngResource/service/$resource) |
| error        | `Function`         | Callback en caso de que la petición falle. [Mas info](https://docs.angularjs.org/api/ngResource/service/$resource) |

```javascript
// ## EJEMPLOS
// Get
angular.module('app')
	.controller('AccountsController', function(AccountsService) {
		var vm = this;
		vm.myAccount = AccountsService.getAccount('001');
						// -> '/api/1.0/subprocesos/accounts/001/'

});
```


// TODO: Continuar...
# Answering Questions

**¿Cómo desacoplarías la lógica de negocio del framework NestJS?**
Empezaria por desacoplar toda la logica de acceso a datos ya que eso no deberia influir en la de negocio.
Implementaria repository pattern para manejar la persistencia de datos, tanto para postgres como para redis.
En el servicio deberia solo inyectar un repositorio que se encargue de devolver las entidades correspondientes, las cuales deberian estar construidas con codigo de typescript puro para quedar desacoplado.
Y teniendo en cuenta que algunas acciones pueden influir en borrar la memoria cache, como la creacion o la modificacion de una orden, en ese caso podemos crear un event bus en memoria por ejemplo. De esta manera cuando se crea una orden simplemente lanzamos un evento de `OrderCreated` y como efecto secundario (fuera del servicio que tiene logica de negocio) podemos borrar la cache de la lista de ordenes.
Si nos queremos desacoplar totalmente del framework tendriamos que crear el servicio el vanilla typescript en este caso.
Una vez desacoplado el repositorio nos queda desacoplarnos del config service, esto lo podemos solucionar directamente recibiendo las configuraciones necesarias por el constructor en lugar de recibir ese config service. O tambien podemos crearnos una interface con los metodos que necesitamos del config service para poder abstraernos del de nest.
Para desacoplarnos del logger podemos implementar un adapter pattern donde tengamos una interface que defina los metodos de log y luego tengamos una implementacion que use el logger de nest o uno custom, la idea es que el servicio no dependa directamente del logger de nest, sino que use nuestra interface.
Ahora bien, para desacoplarnos de los decoradores que se encargan la de inyeccion de dependencias, nosotros tendriamos que hacernos cargos de crear una instancia del servicio. Para este casi se me ocurre que podemos crear un `NestOrderService` por ejemplo que cree una instancia internamente de nuetro nuevo `OrderService` desacoplado y haga de proxy unicamente exponiendo los metodos del `OrderService` al contexto de ejecucion de nest.

**¿Cómo escalarías esta API para soportar miles de órdenes concurrentes?**
En el endpoint de obtener las ordenes craria una paginacion para no devolver todas las ordenes en un solo request si no que se puedan ir pidiendo de a partes.
Los efectos secundarios de avanzar una order para el caso de cuando llega a delivered se puede manejar de manera asyncrona, es decir, la eliminacion de esa orden puede ocurrir luego que se envia el response al usuario.
Sacaria la ejecucion del `Cron Job` del servicio y me lo llevaria a un microservicio independiente o mejor aun a una lambda por ejemplo. Esto seria para tener la libertad de poder escalar la aplicacion de ordenes horizontalmente sin preocuparnos por replicar la ejecucion del cron job.

**¿Qué ventajas ofrece Redis en este caso y qué alternativas considerarías?**
En este caso `Redis` nos sirve para mejorar los tiempos de respuestas de los metodos para obtener las ordenes. Esto se debe a que redis guarda la informacion en memoria principal, es decir, en la RAM que es volatil. De esta manera el acceso a la informacion que se encuentra en la memoria principal tiene mucha menos latencia que acceder a una base de datos en disco.
Esto tambien ayuda a redir la cantidad de request que se hacen en la base de datos SQL, por lo que va a consumir menos recursos.
Si no quisieramos usar redis podriamos usar directamente la memoria de nuestra aplicacion, y no haria falta una conexion externa para obtener la informacion, ni tampoco depender de un servicio o base de datos para manejar el cache. Hay que entender tambien que en este caso vamos a estar aumentando el consumo de memoria del contenedor que contiene nuestra aplicacion.

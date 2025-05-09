![](./assets/images/angular-logo.png "Angular Logo")
# Angular 15 Demo
Proyecto plantilla para desarrollos web basados en tecnología Angular.

# Tabla de contenidos
1. [Arquitectura de referencia](#arquitectura-de-referencia)
   * [Diagrama de arquitectura](#diagrama-de-arquitectura)
   * [Descripción del diagrama (resumen)](#descripcion-del-diagrama)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Guía para configurar el ambiente de desarrollo](#guia-para-configurar-el-ambiente-de-desarrollo)
   * [Windows](#windows)
   * [MacOS (opcional – prioridad 1)](#macos)
   * [Linux (opcional – prioridad 2)](#linux)
4. [Guía para clonar, ejecutar la plantilla y comenzar a desarrollar](#guia-para-clonar-ejecutar-la-plantilla-y-comenzar-a-desarrollar)
   * [Pre-verificación (verificación de líneas de comando, paths por defecto, etc.)](#pre-verificacion)
   * [Clonado (usando degit)](#clonado)
   * [Pre-ajustes (nombres, espacios de nombres, etc.)](#pre-ajustes)
   * [Ejecución y debugging](#ejecucion-y-debugging)
   * [Compilación manual para producción](#compilacion-manual-para-produccion)
5. [Agregar nuevo contenido](#agregar-nuevo-contenido)
   * [Agregar nuevo módulo](#agregar-nuevo-modulo)
   * [Agregar nueva página](#agregar-nueva-pagina)
   * [Ajustes](#agregar-ajustes)

<a name="arquitectura-de-referencia"></a>
# 1. Arquitectura de referencia
<a name="diagrama-de-arquitectura"></a>
## Diagrama de arquitectura
![](./assets/images/angular.drawio.png "Arquitectura de Referencia" )
<a name="descripcion-del-diagrama"></a>
## Descripción del diagrama (resumen)
El diagrama presente transmite una visión general de la arquitectura propuesta para la interfaz de usuario Web, aquí observaremos un breve resumen de cada componente.

| Sección | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1       | La interfaz de usuario web será construida sobre el framework de desarrollo web Angular utilizando el lenguaje TypeScript diseñada bajo los preceptos y directrices de Clean Architecture , Domain-Driven Design  y otros patrones de diseño y desarrollo.                                                                                                                                                                                                                                                               |
| 2       | La capa de presentación (UI) contiene diversos componentes inteligentes y ligeros que definen la vista. La función principal de la capa de presentación es mostrar la interfaz de usuario y responder a las interacciones del usuario.                                                                                                                                                                                                                                                                                   |
| 3       | La capa de aplicación está conformada por los servicios de Angular. Un servicio es un proveedor de datos, que mantiene la lógica de acceso a ellos y operativa relacionada con el negocio y las cosas que se hacen con los datos dentro de una aplicación.                                                                                                                                                                                                                                                               |
| 4       | La capa del dominio posee el nivel más alto en cuanto a tener estabilidad. Esto es uno de los principios de una arquitectura limpia en donde nos dice que “Se debe de estar en dirección a la estabilidad en cuanto a los cambios de los componentes” debido a que es en donde se puede tener mayor impacto en la aplicación ante cualquier cambio en la lógica de negocio que se pueda presentar por lo que prevalecer estabilidad para los casos de usos de cara al negocio en esta capa nos permite estar tranquilos. |
| 5       | La capa de infraestructura posee los componentes de almacenamiento y comunicación con el backend a través de HTTP. Mediante ngrx/store el cual se alberga en el ecosistema de Angular, podemos implementar la persistencia dentro de la aplicación similar a las implementaciones del patrón Redux disponibles en React.                                                                                                                                                                                                 |
| 6       | La capa adicional esta conformada por los componentes de Internacionalización, CSS Framework Unit Test y Linting . Mediante el cual se adapta al ecosistema de Angular.                                                                                                                                                                                   

<a name="estructura-del-proyecto"></a>
# 2. Estructura del proyecto

### Estructura de carpetas
```
 - app
     - auth
         auth-config.module.ts
     - core
         + components
         + constants
         + enums
         + guards
         + interceptor
         + models
         + services
         + utils
     - modules
         - module1
             + page1
             + page2
             module1.module.ts
         + module2
         + module3
         pages-routing.module
         pages.component
         pages.module
     - ngrx
         + actions
         + reducers
         + states
     - shared
         + components
         + directives
         + pipes
         shared.module.ts
 - assets
     + fonts
     - i18n
         en.json
         es.json
     + images
     + svg
 + enviroments
```

### Descripción de las carpetas principales

1. [x] app/

   Contiene los archivos de componentes en los que se definen la lógica y los datos de su aplicación
   [angular-file-structure](https://angular.io/guide/file-structure)

   ```
   - app.module.ts:        Define el módulo raíz, llamado AppModule, que le dice a Angular cómo ensamblar la aplicación.
   - app.component.ts:      Define la lógica del componente raíz de la aplicación, denominado AppComponent. La vista asociada con este componente raíz se convierte en la raíz de la jerarquía de vistas a medida que agrega componentes y servicios a su aplicación.
   - app.component.html :   Define la plantilla HTML asociada con la raíz AppComponent: Por lo general se usa un enrutador de salida dinamico `<router-outlet>`
   - app-routing.module.ts: Define la configuracion de rutas, está dedicado al enrutamiento y es importado por la raíz AppModule.
    ```

2. [x] app/auth/

   Pendiente de implementación

3. [x] app/core/

   Contiene los archivo del nucleo de la aplicación, como componentes genéricos, guards, modelos, servicios, etc.

4. [x] app/core/components/

   Componentes que podemos utilizar cuando una ruta no es encontrada o no tiene autorización de acceso.
   - page-not-found.component.ts
   - page-unauthorized.component.ts

5. [x] app/core/guards/

   Contiene el archivo donde se define la implementación de un AuthGuard, que utiliza para proteger las rutas del acceso no autorizado.
   
   La protección de autenticación proporciona un evento de ciclo de vida llamado canActivate.
   
   El [CanActivate](https://angular.io/api/router/CanActivate) es como un constructor. Se llamará antes de acceder a las rutas. El canActivate tiene que devolver verdadero para acceder a la página. Si devuelve falso, no podremos acceder a la página.
   - CanActivate
   - CanActivateChild
   - CanDeactivate
   - CanLoad
   - Resolve

6. [x] app/core/models/

   En este directorio podemos definir todos los modelos de la lógica del negocio, el uso de objetos a través de **_interface_**
   que contienen sus datos(tipo) puede ser bastante útil. Hace que la vida del desarrollador sea significativamente más fácil.

7. [x] app/core/services/

   En este directorio podemos definir todos los servicios que utilizamos de una API, **_httpClient_**
   través del protocolo HTTP nos permite descargar o cargar datos y acceder a otros servicios back-end.

8. [x] app/modules/

   Las aplicaciones de Angular (hasta la versión 15) son modulares y tienen su propio sistema de modularidad llamado NgModules.

   Los [NgModules](https://angular.io/guide/architecture-modules) son contenedores para un bloque cohesivo de código dedicado a un dominio de aplicación, un flujo de trabajo o un conjunto de capacidades estrechamente relacionado.

   ```
    - pages.module.ts:         Define el módulo de inicio de la app, llamado PagesModule, aca declaramos los módulos comunes de nuestra aplicación.
    - pages.component.ts:      Define la lógica del componente de inicio de la aplicación, denominado PagesComponent. La vista asociada en este componente  convierte en el inicio de de vistas a medida que agrega componentes en la app.
    - pages.component.html :   Define la plantilla inicial de la app, inyectamos el <app-sidenav> y enrutador dinamico <router-outlet>.
    - pages-routing.module.ts: Define la configuracion de mas rutas de la app, para visualizar acceder a las páginas de los módulos.
    ```

9. [x] app/modules/home/

    ``` 
     - api-sample: Componente que interactua con : apiNasaService para la busqueda y visualizacion de datos de la Nasa
     - oauth2-sample : Componente que interactua con el servidor oauth2, obteniendo tokens de autenticacion.
     - welcome : Componente que se inicializa por default de bienvenida - imagen.
   ```

10. [x] app/ngrx/

    [Store](https://ngrx.io/guide/store) es una gestión de estado global impulsada por RxJS para aplicaciones Angular, inspirada en Redux. Store es un contenedor de estado controlado diseñado para ayudar a escribir aplicaciones consistentes y de alto rendimiento sobre Angular

    Se accede al estado con el Store, un observable de estado y un observador de acciones.

    ``` 
    - item.actions.ts : Las acciones describen eventos únicos que se envían desde componentes y servicios, SetItems. 
    - item.reducers.ts: Los cambios de estado son manejados por funciones puras llamadas reductores que toman el estado actual y la última acción para calcular un nuevo estado on(...).
    - item.states.ts  : Se define la interfaz ItemImageState se compone de un texto y una list de items. 
    ```

11. [x] app/shared/

    ```     
    shared.module.ts : La creación de módulos compartidos le permite organizar y optimizar su código. Puede poner directivas, conductos y componentes de uso común en un módulo y luego importar solo ese módulo donde lo necesite en otras partes de su aplicación.
    ``` 

12. [x] app/shared/components/

    ``` 
    - header  : Componente que es inyectado en el home , representa la barra del menu de la App.
    ```

13. [x] assets/

    ```
    - En esta carpeta  disponemos archivos de imagenes, videos y otros archivos (por ejemplo si tenemos una serie de archivos pdf que se descargar de nuestra aplicación) que se copiarán tal cual en la aplicación definitiva
    - Cuando compilamos la aplicación de Angular el contenido de la carpeta 'assets' queda sin cambios y debe ser subida al servidor de internet junto con el resto de archivos.
    ```

14. [x] environments/

    ```
    En esta carpeta encontraremos archivos de configuración base, variables de entorno en diferentes ambientes como desarrollo, test, producción, etc.
    - environment.prod.ts 
    - environment.ts
    ```
<a name="guia-para-configurar-el-ambiente-de-desarrollo"></a>
# 3. Guía para configurar el ambiente de desarrollo
<a name="windows"></a> 
## Windows
Para comenzar se tiene que configurar el ambiente con los siguientes pasos:
1. Se requiere tener instalado la versión actual de Node.js.
   - [Descargar Instalador Node.js  - Windows Installer (.msi)](https://nodejs.org/en/download/)
2. Se requiere tener instalado git.
   - [Descargar Git](https://git-scm.com/download/win)
3. Se requiere tener instalado tiged que es una versión mejorada de degit.
   - Si se tiene instalado el degit, se debe desintalar con el siguiente comando:
      ```
      npm uninstall -g degit
      ```    
   - Luego instalar tiged que es una versión mejorada:
      ```
      npm install -g tiged
      ```    
     - Referencia: https://github.com/tiged/tiged
4. Se requiere tener instalado Angular.
   - La versión que se trabaja en este proyecto es la 13.3.4
      ```
      npm install @angular/cli@13.3.4
      ```
   - Referencia: https://docs.angular.lat/guide/setup-local
5. Se requiere tener una IDE (Se sugiere Visual Studio Code).
   - [Descargar Visual Studio Code](https://code.visualstudio.com/download)

<a name="macos"></a>
## MacOS (opcional – prioridad 1)
Para comenzar se tiene que configurar el ambiente con los siguientes pasos:
1. Se requiere tener instalado la versión actual de Node.js.
   - [Descargar Instalador Node.js  - macOS (.pkg)](https://nodejs.org/en/download/)
2. Se requiere tener instalado git.
   - [Descargar Git](https://git-scm.com/download/mac)
3. Se requiere tener instalado tiged que es una versión mejorada de degit.
   - Si se tiene instalado el degit, se debe desintalar con el siguiente comando:
      ```
      npm uninstall -g degit
      ```    
   - Luego instalar tiged que es una versión mejorada:
      ```
      npm install -g tiged
      ```    
   - Referencia: https://github.com/tiged/tiged
4. Se requiere tener instalado Angular.
   - La versión que se trabaja en este proyecto es la 13.3.4
      ```
      npm install @angular/cli@13.3.4
      ```
   - Referencia: https://docs.angular.lat/guide/setup-local
5. Se requiere tener una IDE (Se sugiere Visual Studio Code).
   - [Descargar Visual Studio Code](https://code.visualstudio.com/download)

<a name="linux"></a>
## Linux (opcional – prioridad 2)
Para comenzar se tiene que configurar el ambiente con los siguientes pasos:
1. Se requiere tener instalado la versión actual de Node.js.
    ```    
    sudo apt-get update
    sudo apt-get install node
    sudo apt-get install npm
    ```
2. Se requiere tener instalado git.
   ```    
    sudo apt-get update
    sudo apt-get upgrade
    sudo apt-get install git
    ```
3. Se requiere tener instalado tiged que es una versión mejorada de degit.
   - Si se tiene instalado el degit, se debe desintalar con el siguiente comando:
        ```
        npm uninstall -g degit
        ```    
   - Luego instalar tiged que es una versión mejorada:
        ```
        npm install -g tiged
        ```    
   - Referencia: https://github.com/tiged/tiged
4. Se requiere tener instalado Angular.
   - La versión que se trabaja en este proyecto es la 13.3.4
      ```
      npm install @angular/cli@13.3.4
      ```
   - Referencia: https://docs.angular.lat/guide/setup-local
5. Se requiere tener una IDE (Se sugiere Visual Studio Code).
   - [Descargar Visual Studio Code](https://code.visualstudio.com/download)

<a name="guia-para-clonar-ejecutar-la-plantilla-y-comenzar-a-desarrollar"></a>
# 4. Guía para clonar, ejecutar la plantilla y comenzar a desarrollar
<a name="pre-verificacion"></a>
## Pre-verificación (verificación de líneas de comando, paths por defecto, etc.)
Para verificar la versión se utiliza el siguiente comando:
  ```
  node --version
  npm --version
  git --version
  ng --version
  ```   
<a name="clonado"></a>
## Clonado (usando degit)
Comando con degit
```
degit https://gitlab.baufest.com/baufest-arquitecturas-de-referencia/angular
```
Comando sin degit
```
git clone https://gitlab.baufest.com/baufest-arquitecturas-de-referencia/angular.git
```
<a name="pre-ajustes"></a>
## Pre-ajustes (nombres, espacios de nombres, etc.)
1. Configuración de seguridad (archivo *auth-config.module.ts*)
   Pendiente de implementación
2. Configuración de idiomas (**i18n**)
    ```
    import { TranslateModule } from '@ngx-translate/core';
    ...
    @NgModule({
        declarations: [
            ...
        ],
        imports: [
            ...
            TranslateModule,
        ],
    })
    ...
    ```
   En cada módulo se debe configurar la internacionalización para que se pueda utilizar en sus respectivos componentes. Ejemplo de uso en las plantillas HTML:
    ```
    <button color="primary">{{'pages.auth.login' | translate }}</button>
    ```    
   En donde: *pages.auth.login* => Ruta definida en los respectivos archivos .json , *assets/i18n/**.json*.
3. Se debe seguir los estándares de la tecnología Angular.

<a name="ejecucion-y-debugging"></a>
## Ejecución y debugging
1. Instalar el proyecto (dependencias)
    ```
    yarn install
    ```
   o
    ```
    npm install
    ```
2. Ejecutar el proyecto
    ```
    ng serve -o
    ```

<a name="compilacion-manual-para-produccion"></a>
## Compilación manual para producción
Para compilar el proyecto apuntando al environment de producción se debe colocar el siguiente comando:
  ```
  ng build --configuration=production
  ```

<a name="agregar-nuevo-contenido"></a>
# 5. Agregar nuevo contenido
<a name="agregar-nuevo-modulo"></a> 
## Agregar nuevo módulo
Para agregar un nuevo módulo debe ejecutar el siguiente comando (ubicado en la carpeta app):
  ```
  ng g n .\modules\module1 --routing
  ```

<a name="agregar-nueva-pagina"></a> 
## Agregar nueva página
Para agregar una nueva página (componente) debe ejecutar el siguiente comando (ubicado en la carpeta app):
  ```
  ng g c .\modules\module1\page1
  ```

<a name="agregar-ajustes"></a> 
## Ajustes
Para que la página funcione correctamente debe agregar el ruteo (routing) dentro del módulo correspondiente (Ejemplo: Module1). Por otro lado, considere utilizar la funcionalidad de idioma l momento de construir el HTML

// Se exporta una constante llamada "environment" que contiene variables de configuración
export const environment = {
  
  // Indica si la aplicación está en modo producción (false = desarrollo)
  production: false,

  // URL base del backend (API REST) al que se conecta la aplicación frontend
  baseUrlApi: 'https://velazco-backend-develop.up.railway.app',

  // Ruta base para funciones relacionadas con autenticación (como OAuth2)
  baseAuthRoute: 'oauth2sample',

  // URL base del frontend donde se maneja la autenticación (generalmente usada para redireccionamiento)
  baseUrlAuth: 'http://localhost:4200/oauth2sample',
};

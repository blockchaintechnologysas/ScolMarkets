# ScolMarkets

Panel profesional inspirado en CoinMarketCap para mostrar los tokens principales de la red Scol. El proyecto utiliza [Vite](https://vitejs.dev/) con React y TypeScript, además de internacionalización con `react-i18next` para ofrecer la experiencia en ocho idiomas (inglés, español, francés, hindi, mandarín, ruso, árabe y alemán).

## Características

- **Listado dinámico de tokens**: la información se alimenta desde variables de entorno para mantener las direcciones de contrato y la configuración fuera del código fuente.
- **Soporte multilingüe**: selector de idioma en tiempo real con traducciones para ocho idiomas.
- **Diseño moderno**: interfaz oscura con enfoque en la moneda nativa Scolcoin.
- **Datos profesionales**: muestra precio, capitalización, volumen y variación diaria, con enlaces al sitio oficial del proyecto.

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior

## Instalación

```bash
npm install
```

## Variables de entorno

La configuración vive en el archivo `.env`. Se incluye un archivo `.env.example` como referencia. Copia el archivo y ajusta los valores a los de tu proyecto:

```bash
cp .env.example .env
```

Variables disponibles:

- `VITE_PLATFORM_NAME`: nombre comercial que se muestra en la cabecera de la aplicación.
- `VITE_NETWORK_NAME`: nombre de la red donde viven los tokens.
- `VITE_TOKENS_DATA`: arreglo serializado en formato JSON con los datos de cada token (símbolo, nombre, dirección, logo, sitio web, descripción y métricas numéricas).

> **Nota:** La aplicación solo consume la información que expones en `VITE_TOKENS_DATA`, por lo que no se muestran direcciones de contrato ni otros datos sensibles en la interfaz si decides omitirlos al renderizar.

## Scripts disponibles

- `npm run dev`: inicia el servidor de desarrollo de Vite.
- `npm run build`: genera la versión optimizada para producción.
- `npm run preview`: sirve la build generada localmente.

## Personalización

1. Actualiza `.env` con los tokens de tu red. La moneda Scolcoin aparece automáticamente como activa nativa si su símbolo es `SCOL`.
2. Ajusta estilos en `src/App.css` y `src/components/TokenTable.css` para adaptar la identidad visual.
3. Agrega o modifica traducciones en `src/i18n.ts` si necesitas soportar más idiomas.

## Licencia

Este proyecto se entrega sin licencia específica. Ajusta según las necesidades de tu comunidad.

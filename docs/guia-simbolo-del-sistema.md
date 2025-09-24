# Guía de implementación en Windows (Símbolo del sistema)

Esta guía describe paso a paso cómo poner en marcha **ScolMarkets** utilizando el **Símbolo del sistema** de Windows. El flujo se inspira en la forma en que el repositorio [`blockchaintechnologysas/p2p`](https://github.com/blockchaintechnologysas/p2p) documenta su despliegue, adaptándolo a los componentes específicos de este panel.

## 1. Preparación del entorno

1. Verifica que tienes instaladas las últimas versiones de [Node.js](https://nodejs.org/) (v18 o superior), [npm](https://www.npmjs.com/) (v9 o superior) y [Git](https://git-scm.com/).
2. Abre el **Símbolo del sistema** (puedes buscar "cmd" en el menú Inicio).
3. Navega hasta la carpeta en la que quieres alojar el proyecto.

```bat
C:\> cd ruta\a\tus\proyectos
```

## 2. Clonar el repositorio

```bat
C:\ruta\a\tus\proyectos> git clone https://github.com/blockchaintechnologysas/ScolMarkets.git
C:\ruta\a\tus\proyectos> cd ScolMarkets
```

## 3. Configurar variables de entorno

1. Copia el archivo de ejemplo `.env.example` y renómbralo como `.env`.
2. Ajusta las variables para definir el nombre de la plataforma, la red y los tokens a mostrar.

```bat
C:\ruta\a\tus\proyectos\ScolMarkets> copy .env.example .env
C:\ruta\a\tus\proyectos\ScolMarkets> notepad .env
```

Dentro del archivo `.env`, personaliza la variable `VITE_TOKENS_DATA` siguiendo el formato JSON del arreglo de tokens. Puedes envolver el contenido entre comillas simples para mantener varias líneas y facilitar la lectura. Cada elemento admite las propiedades:

- `symbol`: símbolo del token (por ejemplo, `SCOL`).
- `name`: nombre legible.
- `address`: dirección del contrato (opcional si solo deseas mostrar datos descriptivos).
- `logo`: URL del logo.
- `website`: sitio web oficial.
- `description`: resumen del proyecto.
- `socials`: objeto opcional con los enlaces a las redes sociales disponibles (Facebook, Instagram, X, YouTube, TikTok, Reddit, Telegram y Discord). Solo se muestran las redes definidas.
- `price`, `marketCap`, `volume24h`, `change24h`, `totalSupply`, `maxSupply`, `circulatingSupply`: métricas numéricas que se renderizan en la tabla.

> Consejo: si vienes del flujo documentado en `blockchaintechnologysas/p2p`, puedes reutilizar la estructura de datos que expone ese panel y pegarla en `VITE_TOKENS_DATA`, ajustando nombres o campos adicionales según sea necesario.

## 4. Instalar dependencias

```bat
C:\ruta\a\tus\proyectos\ScolMarkets> npm install
```

## 5. Levantar el entorno de desarrollo

```bat
C:\ruta\a\tus\proyectos\ScolMarkets> npm run dev
```

El comando imprimirá una URL parecida a `http://localhost:5173/`. Ábrela en tu navegador para visualizar el tablero.

## 6. Generar la build de producción

Cuando estés listo para publicar los cambios, crea la versión optimizada:

```bat
C:\ruta\a\tus\proyectos\ScolMarkets> npm run build
C:\ruta\a\tus\proyectos\ScolMarkets> npm run preview
```

- `npm run build` produce los archivos minificados en la carpeta `dist`.
- `npm run preview` te permite verificar esa build en local antes de desplegarla.

## 7. Buenas prácticas adicionales

- **Control de versiones**: utiliza Git para llevar registro de las personalizaciones. Por ejemplo, crea ramas para nuevas features y usa `git status` para revisar tus cambios.
- **Internacionalización**: edita `src/i18n.ts` si necesitas agregar más idiomas o modificar las traducciones existentes.
- **Estilos**: ajusta los archivos `src/App.css` y `src/components/TokenTable.css` para adaptar la identidad visual a tu comunidad.
- **Distribución**: si vas a hospedar la build en un servidor estático (como GitHub Pages, Vercel o Netlify), sube la carpeta `dist` generada o conéctala a un pipeline de CI/CD.

Con estos pasos podrás replicar, desde el Símbolo del sistema, una experiencia similar a la documentada en el repositorio `p2p`, pero adaptada al panel profesional de tokens de ScolMarkets.

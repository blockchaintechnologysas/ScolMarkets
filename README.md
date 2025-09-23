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

Si prefieres seguir los pasos desde el **Símbolo del sistema de Windows**, consulta la guía detallada en [`docs/guia-simbolo-del-sistema.md`](docs/guia-simbolo-del-sistema.md).

## Variables de entorno

```
mkdir -p /opt/scolmarkets
cd /opt/scolmarkets
git clone https://github.com/blockchaintechnologysas/ScolMarkets.git /opt/scolmarkets
```

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

- `npm run dev`: inicia el servidor de desarrollo de Vite (escucha en el puerto 4687).
- `npm run build`: genera la versión optimizada para producción.
- `npm run preview`: sirve la build generada localmente (también en el puerto 4687).

> **Tip:** si necesitas exponer el servidor de desarrollo o previsualización a la red, recuerda pasar los flags después de `--` p
ara que lleguen a Vite. Por ejemplo:
>
> ```bash
> npm run dev -- --host 0.0.0.0
> npm run preview -- --host 0.0.0.0
> ```

## Despliegue como servicio systemd en Linux

Asumiendo que el código se encuentra en /opt/cex-p2p, para ejecutar la aplicación como un servicio administrado por `systemd`, primero genera la build de producción y verifica que el comando de previsualización funcione correctamente:

```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 4687
```

Una vez que confirmes que todo funciona, crea el archivo de servicio. Por ejemplo:

```bash
sudo useradd --system --home /opt/cex-p2p --shell /usr/sbin/nologin web-list
sudo nano /etc/systemd/system/web-list.service
```

Contenido sugerido del archivo:

```ini
[Unit]
Description=Panel ScolMarkets
After=network.target

[Service]
Type=simple
WorkingDirectory=/ruta/a/ScolMarkets
ExecStart=/usr/bin/npm run preview -- --host 0.0.0.0 --port 4687
Restart=always
Environment=NODE_ENV=production
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

Actualiza `WorkingDirectory`, `User`, `Group` y la ruta a `npm` según la configuración de tu servidor. Finalmente, habilita y levanta el servicio:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now web-list.service
```

Puedes revisar el estado y los registros con:

```bash
systemctl status web-list.service
journalctl -u web-list.service -f
```

## Personalización

1. Actualiza `.env` con los tokens de tu red. La moneda Scolcoin aparece automáticamente como activa nativa si su símbolo es `SCOL`.
2. Ajusta estilos en `src/App.css` y `src/components/TokenTable.css` para adaptar la identidad visual.
3. Agrega o modifica traducciones en `src/i18n.ts` si necesitas soportar más idiomas.

## Licencia

Este proyecto se entrega sin licencia específica. Ajusta según las necesidades de tu comunidad.

# Mis pendientes

Aplicación web sencilla para anotar tareas escolares y marcarlas cuando se terminan. Está hecha con HTML, CSS y JavaScript, se empaqueta con [Vite](https://vite.dev) y se publica con [Nginx](https://nginx.org) dentro de un contenedor de [Docker](https://www.docker.com).

## Requisitos

Solo se necesita **Docker Desktop**. No hace falta instalar Node.js ni Nginx en la computadora: ambos se usan dentro de Docker.

## Cómo ejecutarla

```bash
docker build -t pendientes:1.0.0 .
docker run -d --name pendientes-web -p 80:80 pendientes:1.0.0
```

Después, abre <http://localhost/pendientes/> en el navegador.

Para generar el paquete comprimido en la carpeta `release/`:

```bash
docker build --target package --output release .
```

Para detener y eliminar el contenedor:

```bash
docker rm -f pendientes-web
```

## Estructura

```text
pendientes/
├── index.html            # Página principal
├── src/
│   ├── css/styles.css    # Estilos
│   ├── js/main.js        # Lógica de la lista de tareas
│   └── img/portada.jpg   # Imagen de portada (original)
├── nginx/pendientes.conf # Server block de Nginx
├── vite.config.js        # Configuración del empaquetador
├── Dockerfile            # Construcción en varias etapas
├── .dockerignore         # Archivos que no entran a la construcción
└── package.json          # Dependencias y comandos
```

## Proceso realizado

### 1. Preparación y optimización

El `Dockerfile` usa una construcción de varias etapas (*multi-stage build*). La primera etapa, `build`, parte de una imagen con Node.js 22 y ejecuta:

| Comando | Qué hace |
| --- | --- |
| `npm ci` | Instala las dependencias exactas de `package-lock.json`. |
| `npm run build` | Vite minifica el CSS y el JS y optimiza la imagen. El resultado queda en `dist/`, organizado en `css/`, `js/` e `img/`. |
| `npm run package` | Comprime `dist/` en `release/pendientes-v1.0.0.tar.gz`, el paquete listo para subir a un servidor. |

La etapa `package` solo contiene ese archivo, y `docker build --target package --output release .` lo copia a la computadora.

Resultado de la optimización:

| Archivo | Original | Optimizado |
| --- | --- | --- |
| Imagen `portada.jpg` | 244 KB | 34 KB (−86 %) |
| CSS | 1.6 KB | 1.3 KB (−22 %) |
| JS | 1.6 KB | 1.0 KB (−39 %) |

### 2. Servidor web

La última etapa parte de la imagen oficial de Nginx y recibe solo el resultado de `build`; Node.js no forma parte de la imagen final.

- **Mapeo de directorios:** `dist/` se copia a `/usr/share/nginx/html/pendientes` y `nginx/pendientes.conf` reemplaza la configuración por defecto.
- **Puerto:** el contenedor escucha en el puerto `80` (`EXPOSE 80`) y `-p 80:80` lo conecta con el puerto `80` de la computadora.
- **Server block:** la aplicación responde en la ruta `/pendientes/`; la raíz `/` redirige a esa ruta.

### 3. Versionamiento

El proyecto usa Git con commits descriptivos que siguen la convención [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/) (`feat`, `build`, `refactor`, `docs`). La versión del paquete se define en `package.json` (`1.0.0`) y se usa en el nombre del paquete y en la etiqueta de la imagen.

# Mis pendientes

Aplicación web sencilla para anotar tareas escolares y marcarlas cuando se terminan. Está hecha con HTML, CSS y JavaScript, se empaqueta con [Vite](https://vite.dev) y se publica con [Nginx](https://nginx.org) dentro de [Docker](https://www.docker.com).

## Requisitos

Solo se necesita **Docker Desktop**. No hace falta instalar Node.js ni Nginx en la computadora: ambos se ejecutan dentro de contenedores.

## Cómo ejecutarla

```bash
docker compose up -d
```

Después, abre <http://localhost/pendientes/> en el navegador.

Para detenerla:

```bash
docker compose down
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
├── compose.yaml          # Contenedores de construcción y servidor
└── package.json          # Dependencias y comandos
```

## Proceso realizado

### 1. Preparación y optimización

`docker compose up -d` primero ejecuta el servicio `build` (un contenedor con Node.js 22), que corre tres comandos:

| Comando | Qué hace |
| --- | --- |
| `npm ci` | Instala las dependencias exactas de `package-lock.json`. |
| `npm run build` | Vite minifica el CSS y el JS y optimiza la imagen. El resultado queda en `dist/`, organizado en `css/`, `js/` e `img/`. |
| `npm run package` | Comprime `dist/` en `release/pendientes-v1.0.0.tar.gz`, el paquete listo para subir a un servidor. |

Resultado de la optimización:

| Archivo | Original | Optimizado |
| --- | --- | --- |
| Imagen `portada.jpg` | 244 KB | 34 KB (−86 %) |
| CSS | 1.6 KB | 1.3 KB (−22 %) |
| JS | 1.6 KB | 1.0 KB (−39 %) |

### 2. Servidor web

Cuando termina la construcción, se inicia el servicio `web` con Nginx:

- **Puerto:** el puerto `80` de la computadora se conecta al puerto `80` del contenedor.
- **Mapeo de directorios:** `dist/` se monta en `/usr/share/nginx/html/pendientes` y `nginx/pendientes.conf` reemplaza la configuración por defecto.
- **Server block:** la aplicación responde en la ruta `/pendientes/`; la raíz `/` redirige a esa ruta.

### 3. Versionamiento

El proyecto usa Git con commits descriptivos que siguen la convención [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/) (`feat`, `build`, `docs`). La versión del paquete se define en `package.json` (`1.0.0`).

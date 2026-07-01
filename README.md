# Baby Shower Space

**Estado:** Alpha v0.1

Baby Shower Space es una experiencia digital premium con temática espacial para el Baby Shower de Benjamin. La versión Alpha v0.1 incluye únicamente la Escena 1, la Escena 2, el `SceneManager` actual y la navegación funcional entre ambas escenas.

El proyecto está construido como una experiencia web estática, sin frameworks y sin dependencias externas.

## Cómo ejecutar localmente

Desde la raíz del repositorio:

```bash
python -m http.server 4173
```

Luego abrir en el navegador:

```text
http://127.0.0.1:4173/
```

También puede abrirse `index.html` directamente, pero se recomienda usar un servidor local para validar el comportamiento de módulos JavaScript tal como funcionará en publicación.

## Cómo publicar en GitHub Pages

Publicación manual sugerida:

1. Hacer commit de los cambios aprobados.
2. Hacer push al repositorio oficial.
3. Entrar al repositorio en GitHub.
4. Ir a **Settings > Pages**.
5. En **Build and deployment**, seleccionar **Deploy from a branch**.
6. Elegir la rama que se usará para publicar.
7. Seleccionar la carpeta raíz `/`.
8. Guardar la configuración y esperar a que GitHub Pages genere el sitio.

El archivo principal de publicación es:

```text
index.html
```

## Versiones

- **v0.1 Alpha** — Escena 1 + Escena 2

## Alcance actual

Incluye:

- Escena 1: apertura espacial.
- Escena 2: descubrimiento de Benjamin.
- SceneManager modular.
- Navegación entre Escena 1 y Escena 2.

No incluye:

- RSVP.
- Mapas.
- Regalos.
- Música final.
- Cuenta regresiva.
- Personalización por URL.

# CLI de plantillas Polaris

## Propósito

`scripts/create-template.mjs` crea el esqueleto repetible de una plantilla sin
instalar dependencias ni modificar el motor.

## Uso

```bash
node scripts/create-template.mjs my-event
npm run create-template -- my-event
```

El argumento es obligatorio y acepta letras minúsculas, números y guiones simples.
La ruta se resuelve desde la ubicación del script, por lo que el comando no depende
de carpetas personales.

## Flujo

1. Validar el slug.
2. Resolver `src/scripts/templates/<slug>/` dentro del repositorio.
3. Abortar si el directorio existe.
4. Crear configuración, recursos, tres escenas, registro, manifiesto y README en
   UTF-8.
5. Informar la ruta creada y recordar el registro central.

## Salida

La plantilla generada incluye un audio WAV silencioso embebido para que el contrato
de audio sea funcional sin copiar recursos de otra experiencia. El registro forma el
grafo `opening → message → closing`; el autoplay termina en `closing`.

La CLI no crea automáticamente HTML ni decide diseño, contenido, recursos finales o
ruta pública. Esas decisiones requieren el trabajo creativo aprobado correspondiente.

## Registro y publicación

Después de personalizar la plantilla:

1. crear `experiences/<slug>/index.html` y su entry point;
2. importar el manifiesto en `src/scripts/templates/index.js`;
3. añadir una sola entrada con metadatos, placeholder y `launchUrl`;
4. ejecutar las validaciones y revisar el recorrido en móvil.

## Errores seguros

- Sin argumento o con un slug inválido: sale con código distinto de cero y muestra el
  uso correcto.
- Si el destino existe: no escribe ni reemplaza archivos.
- Ante un error de filesystem: Node informa el fallo y detiene la generación.

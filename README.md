# Festivos Colombia

Sitio en Next.js (App Router) que muestra si hoy es festivo en Colombia y el calendario completo de festivos por año. Pensado para SEO: genera una página estática por año, lista para indexarse en Google.

## Cómo funciona

Los festivos se calculan por algoritmo, sin base de datos ni API. La lógica vive en `lib/holidays.ts` y se basa en:

- La Ley 51 de 1983 (Ley Emiliani), que traslada varios festivos al lunes siguiente.
- El algoritmo de Computus para la fecha de Pascua, del que salen los festivos de Semana Santa.
- La Ley 2578 de 2026, que creó el Día de la Virgen del Rosario de Chiquinquirá (9 de julio).

Esto significa que el sitio responde para cualquier año, pasado o futuro, sin tener que actualizar datos a mano.

## Rutas

- `/` muestra el día de hoy y el calendario del año actual.
- `/festivos/[año]` una página por año, por ejemplo `/festivos/2027`.
- `/sitemap.xml` y `/robots.txt` se generan solos.

Se pre-generan los años de una ventana (actual menos 3 hasta más 10). Cualquier otro año se renderiza bajo demanda la primera vez que alguien lo visita y queda cacheado.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Variable de entorno

Crea un archivo `.env.local` (puedes copiar `.env.example`) y pon tu dominio real:

```
NEXT_PUBLIC_SITE_URL=https://tudominio.com
```

Esta URL se usa en el sitemap, en los canonical y en el JSON-LD. Sin la barra final.

## Despliegue en Vercel

1. Sube este proyecto a un repositorio de GitHub.
2. En Vercel, importa el repositorio (Add New, Project).
3. Vercel detecta Next.js automáticamente. No cambies los comandos de build.
4. En Settings, Environment Variables, agrega `NEXT_PUBLIC_SITE_URL` con tu dominio.
5. Despliega. Luego conecta tu dominio en Settings, Domains.

## Google Search Console

1. Agrega tu propiedad (mejor por dominio) y verifícala.
2. En Sitemaps, envía `https://tudominio.com/sitemap.xml`.
3. Usa Inspección de URL para pedir indexación de las páginas de año más importantes.

## Mantenimiento

Si una ley nueva crea o quita un festivo, edita solo `lib/holidays.ts` y vuelve a desplegar. Todo el sitio se recalcula desde ahí.

## SEO incluido

- Título y meta descripción únicos por año.
- Canonical por ruta.
- JSON-LD (Schema.org ItemList con un Event por festivo).
- Tabla de festivos en HTML del servidor, indexable sin JavaScript.
- Enlazado interno entre años y un pie con el listado de años.
- sitemap.xml y robots.txt.

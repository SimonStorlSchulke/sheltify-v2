# run / build:
## sheltify-backend
`go run *`

## sheltify-admin
`npm run start`

## article-renderer
`npm run build`

## sheltify-lib
`tsc`

## clients
`npm run snhg`
`npm run mft`
`npm run hhg`

* build article-theme: `npm run provided-article-theme:snhg`

## Spezialsektion für tenant erstellen:
- Sektionsdefinition hinzufügen in hinzufügen clients/sites/{tenant}/public/provided-special-sections.js
- Renderer in `article-renderer/components/special-sections/{tenant}` entwickeln
  - export in index.js und _index.scss nicht vergessen
- in `Article.astro` zu componentMap hinzufügen
- in section-renderer.component.html hinzufügen

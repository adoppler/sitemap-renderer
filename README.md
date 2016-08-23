# Sitemap Renderer

Renders a static site with support for a template file and an accurate sitemap.xml.

This can be used to pre-render an entire static site.

## Usage

```
const sitemapRenderer = require('sitemap-renderer')

sitemapRenderer.renderSite({
  hostname: 'https://www.example.com'
  pages: [{ uri: '/home', file: '/path/to/source/file' }],
  template: 'path/to/template.dot',
  output: 'path/to/output/folder',
  render(path) {
    return Promise.resolve('html string')
  },
})

```

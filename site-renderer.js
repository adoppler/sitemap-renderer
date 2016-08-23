const path = require('path')

const dot = require('dot')
const mkdirp = require('mkdirp-promise')
const pretty = require('js-beautify').html
const readfile = require('fs-readfile-promise')
const sitemap = require('sitemap')
const writeFile = require('fs-writefile-promise')

function getTemplateFunction(template, render) {
  if (template) {
    return readfile(template).then(buffer => {
      const templatize = dot.template(buffer.toString())

      return uri => Promise.resolve(render(uri)).then(data => templatize(data))
    })
  }

  return Promise.resolve(uri => render(uri))
}

function writeSitemap(hostname, pages, output) {
  const xml = sitemap.createSitemap({
    hostname,
    urls: pages.filter(p => !p.uri.endsWith('404')).map(page => ({
      lastmodfile: page.file,
      lastmodrealtime: true,
      changefreq: null,
      url: page.uri,
    })),
  }).toString()

  return writeFile(path.join(output, 'sitemap.xml'), pretty(xml))
}

function renderPage(url, file, templateFn, output) {
  const isIndex = !!file.match(/index\.[\w]+$/)
  const name = isIndex ? `${url}/index.html` : `${url}.html`

  const filename = path.join(output, name)
  const parentdir = path.join(filename, '..')

  return mkdirp(parentdir)
          .then(() => templateFn(url))
          .then(html => writeFile(filename, html))
}

function renderSite({ hostname, pages, output, render, template, skipSitemap }) {
  if (!Array.isArray(pages)) {
    return Promise.reject({ message: 'Missing array of pages' })
  } else if (!hostname) {
    return Promise.reject({ message: 'Missing hostname' })
  } else if (!output) {
    return Promise.reject({ message: 'Missing output directory' })
  } else if (typeof render !== 'function') {
    return Promise.reject({ message: 'Missing render function' })
  }

  return Promise.all([
    getTemplateFunction(template, render),
    mkdirp(output),
  ]).then(setup => {
    const templateFn = setup[0]

    const pagesToRender = pages.map(p => renderPage(p.uri, p.file, templateFn, output))


    return Promise.all(pagesToRender.concat(skipSitemap ? undefined : [writeSitemap(hostname, pages, output)]))
  })
}

exports.renderSite = renderSite

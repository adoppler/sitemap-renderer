import path from 'path'

import readfile from 'fs-readfile-promise'
import rmrf from 'rimraf-promise'
import test from 'ava'

import { renderSite } from '../site-renderer'

const output = path.join(__dirname, 'fixtures/dist-template')

test.before(() => rmrf(output))

test('render to html files', t =>
  renderSite({
    hostname: 'https://www.example.com',
    pages: [
      { uri: '/', file: path.join(__dirname, 'fixtures/pages/index.js') },
      { uri: '/about', file: path.join(__dirname, 'fixtures/pages/about.js') },
      { uri: '/404', file: path.join(__dirname, 'fixtures/pages/404.js') },
    ],
    output,
    template: path.join(__dirname, 'fixtures/template.dot'),
    render(url) {
      return {
        title: `TITLE FOR ${url}`,
        html: `<h1>HTML FOR ${url}</h1>`,
      }
    },
  }).then(() => readfile(path.join(output, '/about.html')))
    .then(buf => {
      const rendered = buf.toString()
      t.true(rendered.indexOf('<title>TITLE FOR /about</title>') > 0)
      t.true(rendered.indexOf('<h1>HTML FOR /about</h1>') > 0)
    })
    .catch(err => {
      t.fail(err.message)
    })
)

test.after(() => rmrf(output))

import fs from 'fs'
import path from 'path'

import rmrf from 'rimraf-promise'
import test from 'ava'

import { renderSite } from '../site-renderer'

const output = path.join(__dirname, 'fixtures/dist-pages')

test.before(() => rmrf(output))

test('render to html files', t =>
  renderSite({
    hostname: 'https://www.example.com',
    pages: [
      { uri: '/', file: path.join(__dirname, 'fixtures/pages/index.js') },
      { uri: '/about', file: path.join(__dirname, 'fixtures/pages/about.js') },
      { uri: '/product', file: path.join(__dirname, 'fixtures/pages/product/index.js') },
      { uri: '/404', file: path.join(__dirname, 'fixtures/pages/404.js') },
    ],
    output,
    render() {
      return ''
    },
  }).then(() => {
    t.true(fs.existsSync(path.join(output, 'index.html')))
    t.true(fs.existsSync(path.join(output, '/about.html')))
    t.true(fs.existsSync(path.join(output, '/product/index.html')))
    t.true(fs.existsSync(path.join(output, '/404.html')))
  })
  .catch(err => {
    t.fail(err.message)
  })
)

test.after(() => rmrf(output))

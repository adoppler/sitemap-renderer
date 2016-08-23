import path from 'path'

import parse from 'xml-parser'
import readfile from 'fs-readfile-promise'
import rmrf from 'rimraf-promise'
import test from 'ava'

import { renderSite } from '../site-renderer'

const output = path.join(__dirname, 'fixtures/dist-sitemap')

test.before(() => rmrf(output))

test('sitemap.xml generation', t =>
  renderSite({
    hostname: 'https://www.example.com',
    pages: [
      { uri: '/', file: path.join(__dirname, 'fixtures/pages/index.js') },
      { uri: '/about', file: path.join(__dirname, 'fixtures/pages/about.js') },
      { uri: '/product', file: path.join(__dirname, 'fixtures/pages/product/index.js') },
    ],
    output,
    render() {
      return ''
    },
  }).then(() => readfile('fixtures/dist-sitemap/sitemap.xml'))
    .then(buf => {
      const sitemap = parse(buf.toString())
      const pages = sitemap.root.children

      t.is(pages[0].children[0].content, 'https://www.example.com/')
      t.is(pages[1].children[0].content, 'https://www.example.com/about')
      t.is(pages[2].children[0].content, 'https://www.example.com/product')
    })
    .catch(err => {
      t.fail(err.message)
    })
)

test.after(() => rmrf(output))

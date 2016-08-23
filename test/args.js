import test from 'ava'

import { renderSite } from '../site-renderer'

test('requires an array of pages to render', t =>
  renderSite({})
    .then(() => {
      t.fail('Should not have passed')
    })
    .catch(err => {
      t.is(err.message, 'Missing array of pages')
    })
)

test('requires a hostname', t =>
  renderSite({ pages: [] })
    .then(() => {
      t.fail('Should not have passed')
    })
    .catch(err => {
      t.is(err.message, 'Missing hostname')
    })
)

test('requires an output directory', t =>
  renderSite({ pages: [], hostname: 'localhost' })
    .then(() => {
      t.fail('Should not have passed')
    })
    .catch(err => {
      t.is(err.message, 'Missing output directory')
    })
)

test('requires a render function', t =>
  renderSite({ pages: [], hostname: 'localhost', output: __dirname })
    .then(() => {
      t.fail('Should not have passed')
    })
    .catch(err => {
      t.is(err.message, 'Missing render function')
    })
)

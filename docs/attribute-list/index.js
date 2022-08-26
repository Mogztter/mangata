'use strict'

import antlr4 from 'antlr4'

import AttributeListLexer from './build/attributeListLexer.js'
import AttributeListParser from './build/attributeListParser.js'

export default function parse (input) {
  const chars = new antlr4.InputStream(input)
  const lexer = new AttributeListLexer(chars)
  const tokens = new antlr4.CommonTokenStream(lexer)
  const parser = new AttributeListParser(tokens)
  parser.buildParseTrees = true
  const attributeList = parser.attributeList()
  let attrs = attributeList.attr()
  let index = 1
  return attrs.reduce((current, attr) => {
    let attributeNameWithValue = attr.AttributeNameWithValue()
    if (attributeNameWithValue) {
      let [name, ...rest] = attributeNameWithValue.getText().split('=')
      let value = rest.join('=').trim()
      if (value.length > 1 && value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1).replaceAll(/\\"/g, '"')
      }
      if (value.length > 1 && value.startsWith('\'') && value.endsWith('\'')) {
        value = value.slice(1, -1).replaceAll(/\\'/g, '\'')
      }
      name = name.trim()
      if (name === 'options' || name === 'opts') {
        const opts = value
          .split(',')
          .map((v) => v.trim())
          .filter((v) => v.length > 0)
        for (const opt of opts) {
          current[`${opt}-option`] = ''
        }
      } else {
        current[name] = value
      }
    } else {
      const attributeNameCtx = attr.AttributeName()
      const positionalAttributeValueCtx = attr.PositionalAttributeValue()
      let text
      if (attributeNameCtx !== null) {
        text = attributeNameCtx.getText().trim()
      } else if (positionalAttributeValueCtx !== null) {
        text = positionalAttributeValueCtx.getText().trim()
      } else {
        text = null
      }
      const positional = current['$positional'] || {}
      if (text === null || text.length === 0) {
        text = null
      } else {
        if (text.length > 1 && text.startsWith('"') && text.endsWith('"')) {
          text = text.slice(1, -1).replaceAll(/\\"/g, '"')
        }
        if (text.length > 1 && text.startsWith('\'') && text.endsWith('\'')) {
          text = text.slice(1, -1).replaceAll(/\\'/g, '\'')
        }
      }
      positional[index] = text
      index += 1
      current['$positional'] = positional
    }
    return current
  }, {})
}

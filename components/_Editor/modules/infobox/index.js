import React from 'react'
import MarkdownSerializer from 'slate-mdast-serializer'

import { matchBlock } from '../../utils'
import createUi from './ui'

export default ({ rule, subModules, TYPE }) => {
  const editorOptions = rule.editorOptions || {}

  const titleModule = subModules.find(m => m.name === 'headline')
  if (!titleModule) {
    throw new Error('Missing headline submodule')
  }

  const paragraphModule = subModules.find(m => m.name === 'paragraph')
  if (!paragraphModule) {
    throw new Error('Missing paragraph submodule')
  }

  const figureModule = subModules.find(m => m.name === 'figure')

  const orderedSubModules = [
    titleModule,
    figureModule,
    paragraphModule
  ].filter(Boolean)

  const childSerializer = new MarkdownSerializer({
    rules: orderedSubModules.reduce(
      (a, m) => a.concat(
        m.helpers && m.helpers.serializer &&
        m.helpers.serializer.rules
      ),
      []
    ).filter(Boolean)
  })

  const Container = rule.component

  const serializerRule = {
    match: matchBlock(TYPE),
    matchMdast: rule.matchMdast,
    fromMdast: (node, index, parent, rest) => {
      return {
        kind: 'block',
        type: TYPE,
        data: node.data,
        nodes: childSerializer.fromMdast(node.children, 0, node, rest)
      }
    },
    toMdast: (object, index, parent, rest) => {
      return {
        type: 'zone',
        identifier: TYPE,
        data: object.data,
        children: childSerializer.toMdast(object.nodes, 0, object, rest)
      }
    }
  }

  const serializer = new MarkdownSerializer({
    rules: [
      serializerRule
    ]
  })

  return {
    TYPE,
    helpers: {
      serializer
    },
    changes: {},
    ui: createUi({
      TYPE,
      subModules: orderedSubModules,
      editorOptions,
      figureModule
    }),
    plugins: [
      {
        renderNode ({ node, children, attributes }) {
          if (!serializerRule.match(node)) return

          const hasFigure = figureModule && node.nodes.find(n => n.type === figureModule.TYPE)
          return (
            <Container
              {...node.data.toJS()}
              figureSize={hasFigure ? node.data.get('figureSize', 'S') : undefined}
              attributes={attributes}>
              {children}
            </Container>
          )
        },
        onKeyDown (event, change) {
          const isBackspace = event.key === 'Backspace'
          if (event.key !== 'Enter' && !isBackspace) return

          const { value } = change
          const inBox = value.document.getClosest(value.startBlock.key, matchBlock(TYPE))
          if (!inBox) return

          const isEmpty = !inBox || !inBox.text

          // unwrap empty paragraph on enter
          const block = value.startBlock
          if (!block.text && !isBackspace) {
            event.preventDefault()
            return change
              .unwrapBlock(TYPE)
              .unwrapBlock(paragraphModule.TYPE)
          }

          // rm info box if empty on backspace
          if (isBackspace) {
            event.preventDefault()
            const t = change.deleteBackward()
            if (isEmpty) {
              t.removeNodeByKey(inBox.key)
            }
            return t
          }
        },
        schema: {
          blocks: {
            [TYPE]: {
              nodes: [
                {
                  kinds: ['block'], types: [titleModule.TYPE], min: 1, max: 1
                },
                figureModule && {
                  kinds: ['block'], types: [figureModule.TYPE], min: 0, max: 1
                },
                {
                  kinds: ['block'], types: [paragraphModule.TYPE], min: 1
                }
              ].filter(Boolean),
              normalize: (change, reason, { node, index, child }) => {
                let orderedTypes = orderedSubModules
                  .map(subModule => subModule.TYPE)
                if (figureModule) {
                  const hasFigure = !!node.nodes.find(n => n.type === figureModule.TYPE)
                  if (!hasFigure) {
                    orderedTypes = orderedTypes.filter(type => type !== figureModule.TYPE)
                  }
                }

                if (node.nodes.first().kind !== 'block') {
                  child = node.nodes.first()
                  reason = 'child_kind_invalid'
                  index = 0
                }

                if (reason === 'child_required') {
                  change.insertNodeByKey(
                    node.key,
                    index,
                    {
                      kind: 'block',
                      type: orderedTypes[index]
                    }
                  )
                }
                if (reason === 'child_kind_invalid') {
                  change.wrapBlockByKey(
                    child.key,
                    {
                      type: orderedTypes[index]
                    }
                  )
                }
                if (reason === 'child_type_invalid') {
                  change.setNodeByKey(
                    child.key,
                    {
                      type: orderedTypes[index]
                    }
                  )
                }
                if (reason === 'child_unknown') {
                  if (index >= orderedTypes.length) {
                    change.unwrapNodeByKey(child.key)
                  }
                }
              }
            }
          }
        }
      }
    ]
  }
}

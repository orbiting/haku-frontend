import MarkdownSerializer from 'slate-mdast-serializer'
import { Block } from 'slate'
import { matchBlock } from '../utils'

export const getData = data => ({
  columns: 2,
  module: 'figuregroup',
  ...data || {}
})

export const getNewBlock = options => () => {
  const [
    figureModule,
    captionModule
  ] = options.subModules

  return Block.create({
    type: options.TYPE,
    data: getData(),
    nodes: [
      figureModule.helpers.newBlock(),
      figureModule.helpers.newBlock(),
      Block.create({ type: captionModule.TYPE })
    ]
  })
}

export const fromMdast = ({
  TYPE,
  subModules
}) => (node,
  index,
  parent,
  {
    visitChildren,
    context
  }
) => {
  const [
    figureModule,
    captionModule
  ] = subModules

  const figureSerializer = figureModule.helpers.serializer

  const data = getData(node.data)

  const caption = node.children[ node.children.length - 1 ]
  const hasCaption = caption.type === 'paragraph'
  const figures = (hasCaption
    ? node.children.slice(0, -1)
    : node.children).map(
    v => figureSerializer.fromMdast(v)
  )
  const nodes = hasCaption
    ? figures.concat(
      captionModule.helpers.serializer.fromMdast(caption)
    )
    : figures

  const result = {
    kind: 'block',
    type: TYPE,
    data,
    nodes
  }
  return result
}

export const toMdast = ({
  TYPE,
  subModules
}) => (
  node,
  index,
  parent,
  {
    visitChildren,
    context
  }
) => {
  const [ figureModule, captionModule ] = subModules

  const mdastChildren = node.nodes
    .slice(0, -1).map(v =>
      figureModule.helpers.serializer.toMdast(v)
    )
    .concat(
      captionModule.helpers.serializer.toMdast(
        node.nodes[node.nodes.length - 1]
      )
    )

  return {
    type: 'zone',
    identifier: 'FIGUREGROUP',
    children: mdastChildren,
    data: node.data
  }
}

const getSerializer = options =>
  new MarkdownSerializer({
    rules: [
      {
        match: matchBlock(options.TYPE),
        matchMdast:
          options.rule.matchMdast,
        fromMdast: fromMdast(options),
        toMdast: toMdast(options)
      }
    ]
  })

export default options => ({
  helpers: {
    serializer: getSerializer(options)
  }
})

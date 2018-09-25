import MarkdownSerializer from 'slate-mdast-serializer'
import { matchImageParagraph } from 'mdast-react-render/lib/utils'
import shortId from 'shortid'
import { matchBlock } from '../utils'

export const getData = data => ({
  url: null,
  textPosition: 'topleft',
  color: '#000',
  bgColor: '#fff',
  center: false,
  image: null,
  byline: null,
  kind: 'editorial',
  titleSize: 'standard',
  teaserType: 'frontImage',
  reverse: false,
  portrait: true,
  showImage: true,
  onlyImage: false,
  id: (data && data.id) || shortId(),
  ...data || {}
})

export const getSubmodules = ({ subModules }) => {
  const [titleModule, subjectModule, leadModule, formatModule, paragraphModule] = subModules

  if (!titleModule) {
    throw new Error('Missing headline submodule')
  }

  if (!subjectModule) {
    throw new Error('Missing headline submodule')
  }

  if (!leadModule) {
    throw new Error('Missing headline submodule')
  }

  if (!formatModule) {
    throw new Error('Missing headline submodule')
  }

  if (!paragraphModule) {
    throw new Error('Missing paragraph submodule')
  }

  const linkModule = paragraphModule.subModules.find(
    subModule => {
      return subModule.name === 'link'
    }
  )

  if (!linkModule) {
    throw new Error('Missing link module in paragraph submodule')
  }

  return {
    titleModule,
    subjectModule,
    leadModule,
    formatModule,
    paragraphModule,
    linkModule
  }
}

const getRules = subModules => subModules.reduce(
  (a, m) => a.concat(
    m.helpers && m.helpers.serializer &&
    m.helpers.serializer.rules
  ),
  []
).filter(Boolean)

export const fromMdast = ({
  TYPE,
  subModules
}) => (node,
  index,
  parent,
  rest
) => {
  const imageParagraph = node.children.find(matchImageParagraph)

  // Remove module key from data
  const { module, ...data } = getData(node.data)
  if (imageParagraph) {
    data.image = imageParagraph.children[0].url
  }

  const childSerializer = new MarkdownSerializer({
    rules: getRules(subModules)
  })

  const nodes = childSerializer.fromMdast(
    node.children.filter(node => node !== imageParagraph),
    0,
    node,
    {
      context: {
        ...rest.context,
        // pass link color to link through context
        color: data.color
      }
    }
  )
    // enhance all immediate children with data
    .map(node => ({ ...node, data: { ...node.data, ...data } }))

  const result = {
    object: 'block',
    type: data.onlyImage ? `${TYPE}_VOID` : TYPE,
    data: {
      ...data,
      module: 'teaser'
    },
    nodes: nodes
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
  const args = [
    {
      visitChildren,
      context
    }
  ]

  const childSerializer = new MarkdownSerializer({
    rules: getRules(subModules)
  })

  const { image, module, ...data } = node.data
  const imageNode = image && {
    type: 'paragraph',
    children: [
      {
        type: 'image',
        url: image
      }
    ]
  }
  return {
    type: 'zone',
    identifier: 'TEASER',
    data,
    children: [
      ...(imageNode ? [imageNode] : []),
      ...childSerializer.toMdast(node.nodes, 0, node, ...args)
    ]
  }
}

export const getSerializer = options =>
  new MarkdownSerializer({
    rules: [
      {
        match: node => matchBlock(options.TYPE)(node) || matchBlock(`${options.TYPE}_VOID`)(node),
        matchMdast:
          options.rule.matchMdast,
        fromMdast: fromMdast(options),
        toMdast: toMdast(options)
      }
    ]
  })

export default options => {
  return ({
    helpers: {
      serializer: getSerializer(options)
    }
  })
}

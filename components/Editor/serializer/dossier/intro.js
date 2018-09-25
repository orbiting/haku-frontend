import { matchBlock } from '../utils'
import MarkdownSerializer from 'slate-mdast-serializer'
import { matchImageParagraph } from 'mdast-react-render/lib/utils'

export const getSubmodules = ({ subModules }) => {
  const [formatModule, titleModule, leadModule] = subModules

  if (!titleModule) {
    throw new Error('Missing headline submodule')
  }

  if (!leadModule) {
    throw new Error('Missing headline submodule')
  }

  if (!formatModule) {
    throw new Error('Missing headline submodule')
  }

  return {
    titleModule,
    leadModule,
    formatModule
  }
}

const getRules = subModules => subModules.reduce(
  (a, m) => a.concat(
    m.helpers && m.helpers.serializer &&
    m.helpers.serializer.rules
  ),
  []
).filter(Boolean)

export const fromMdast = options => {
  return (node, index, parent, rest) => {
    const { TYPE, subModules } = options
    const imageParagraph = node.children.find(matchImageParagraph)

    // Remove module key from data
    const { module, ...data } = getData(node.data)
    if (imageParagraph) {
      data.image = imageParagraph.children[0].url
    }

    const childSerializer = new MarkdownSerializer({
      rules: getRules(subModules)
    })

    const nodes = childSerializer
      .fromMdast(
        node.children.filter(node => node !== imageParagraph),
        0,
        node, {
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
      type: TYPE,
      data: {
        ...getData(data),
        module: 'teaser'
      },
      nodes: nodes
    }
    return result
  }
}

export const toMdast = (options) => {
  return (node, index, parent, rest) => {
    const { subModules } = options
    const { visitChildren, context } = rest

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
      data: getData(data),
      children: [
        ...(imageNode ? [imageNode] : []),
        ...childSerializer.toMdast(node.nodes, 0, node, ...args)
      ]
    }
  }
}

export const getSerializer = options =>
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

export const getData = data => ({
  url: null,
  textPosition: 'topleft',
  color: '#000',
  bgColor: '#fff',
  center: false,
  image: null,
  kind: 'editorial',
  titleSize: 'standard',
  teaserType: 'dossierIntro',
  reverse: false,
  portrait: true,
  showImage: true,
  onlyImage: false,
  ...data || {}
})

export default options => ({
  rule: options.rule,
  helpers: {
    serializer: getSerializer(options)
  }
})

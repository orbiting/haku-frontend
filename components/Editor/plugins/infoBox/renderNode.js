import { SchemaComponent } from '../../base/components/Schema'
import { isBlock } from '../../base/lib'

export default ({ children, attributes, node }) => {
  if (isBlock('infoBox', node)) {
    return (
      <SchemaComponent
        name='infoBox'
        attributes={attributes}
        size={node.data.get('size')}
        figureSize={node.data.get('figureSize')}
      >
        {children}
      </SchemaComponent>
    )
  }
  if (isBlock('infoBoxTitle', node)) {
    return (
      <SchemaComponent name='infoBoxTitle' attributes={attributes}>
        <span
          style={{
            display: 'block',
            position: 'relative'
          }}
        >
          {children}
        </span>
      </SchemaComponent>
    )
  }
  if (isBlock('infoBoxText', node)) {
    return (
      <SchemaComponent
        name='infoBoxText'
        attributes={{
          ...attributes,
          style: { position: 'relative' }
        }}
      >
        <span style={{ position: 'relative', display: 'block' }}>
          {children}
        </span>
      </SchemaComponent>
    )
  }
}

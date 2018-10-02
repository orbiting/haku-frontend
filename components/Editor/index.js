import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import { getSerializer } from './serializer'
import BaseEditor from './base/components/Editor'
import EditorUI from './base/components/UI'
import EditorStateProvider from './base/StateProvider'

import Loader from '../Loader'

import articleSettings from './settings/article'
import frontSettings from './settings/front'
import formatSettings from './settings/format'

export { EditorUI, EditorStateProvider }

const styles = {
  container: css({
    width: '100%',
    position: 'relative'
  }),
  document: {
    width: '100%'
  }
}

const Container = ({ children }) => (
  <div {...styles.container}>{children}</div>
)

const Document = ({ children, readOnly }) => (
  <div
    {...styles.document}
    style={
      readOnly
        ? {
          pointerEvents: 'none',
          opacity: 0.6
        }
        : {}
    }
  >
    {children}
  </div>
)

export const getEditorSettings = schema => {
  const { serializer, newDocument, editorSchema } = getSerializer(
    schema
  )
  const { plugins } =
    schema.template === 'front'
      ? frontSettings({ schema: editorSchema })
      : schema.template === 'format'
        ? formatSettings({ schema: editorSchema })
        : articleSettings({ schema: editorSchema })
  return {
    plugins,
    serializer,
    newDocument,
    editorSchema
  }
}

export class Editor extends Component {
  constructor (props) {
    super(props)
    this.onChange = change => {
      const { value, onChange, onDocumentChange } = this.props

      if (change.value !== value) {
        onChange(change)
        if (!change.value.document.equals(value.document)) {
          onDocumentChange(change.value.document, change)
        }
      }
    }
  }
  render () {
    const { value, plugins, schema, readOnly } = this.props
    return (
      <Container>
        <Loader
          loading={!value}
          render={() => (
            <Document readOnly={readOnly}>
              <BaseEditor
                schema={schema}
                value={value}
                plugins={plugins}
                readOnly={readOnly}
                onChange={this.onChange}
              />
            </Document>
          )}
        />
      </Container>
    )
  }
}

Editor.propTypes = {
  value: PropTypes.object,
  plugins: PropTypes.array,
  readOnly: PropTypes.bool,
  schema: PropTypes.object,
  onChange: PropTypes.func,
  onDocumentChange: PropTypes.func
}

Editor.defaultProps = {
  onChange: () => true,
  onDocumentChange: () => true
}

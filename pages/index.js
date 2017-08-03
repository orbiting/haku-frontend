import React, { Component } from 'react'
import { Raw, resetKeyGenerator } from 'slate'
import App from '../lib/App'
import createEditor from '../lib/editor'
import StyleguideTheme from '../lib/themes/styleguide'

import lorem from '../lib/templates/lorem.json'

const { Editor } = createEditor(StyleguideTheme)

const getInitialState = () => {
  resetKeyGenerator()
  return {
    state: Raw.deserialize(lorem, { terse: true })
  }
}

export default class Index extends Component {
  constructor(...args) {
    super(...args)
    this.state = getInitialState()
  }

  commitHandler(state) {
    console.log(state.toJS())
  }

  render() {
    return (
      <App>
        <Editor
          state={this.state.state}
          onChange={this.commitHandler.bind(this)}
        />
      </App>
    )
  }
}

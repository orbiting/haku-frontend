import React, { Fragment } from 'react'

import { FaHeading as SubheadIcon } from 'react-icons/fa'
import FormatBlockButton from '../../base/components/FormatBlockButton'
import { withTheme } from '../../base/apps/theme'
import Selected from '../../base/components/Selected'
import {
  SidebarTextOptions,
  SidebarInsertOptions,
  SidebarBlockOptions
} from '../../base/components/UI'

import {
  BlockButtons,
  TextButtons,
  InsertButtons
} from '../common/ui'

export const SubheadButton = withTheme()(
  props => (
    <FormatBlockButton
      block={'subhead'}
      {...props}
      {...props.styles.buttons.iconButton}
    >
      <SubheadIcon size={22} />
    </FormatBlockButton>
  )
)

export const SubheadUI = ({ editor }) => (
  <Selected nodeType='subhead' offset={1}>
    {({ node }) => (
      <Fragment>
        <SidebarInsertOptions>
          <InsertButtons
            node={node}
            editor={editor}
          />
        </SidebarInsertOptions>
        <SidebarBlockOptions>
          <BlockButtons
            node={node}
            editor={editor}
          />
        </SidebarBlockOptions>
        <SidebarTextOptions>
          <TextButtons
            node={node}
            editor={editor}
          />
        </SidebarTextOptions>
      </Fragment>
    )}
  </Selected>
)

export const renderUI = ({ editor }) => {
  return <SubheadUI editor={editor} />
}

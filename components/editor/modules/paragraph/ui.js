import React from 'react'
import { css } from 'glamor'
import { createBlockButton } from '../utils'
import { PARAGRAPH } from './'
import styles from '../styles'

export const ParagraphButton = createBlockButton({
  type: PARAGRAPH
})(
  ({ active, disabled, ...props }) =>
    <span
      {...{...css(styles.blockButton), ...props}}
      data-active={active}
      data-disabled={disabled}
      >
      Paragraph
    </span>
)

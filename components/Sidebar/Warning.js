import React from 'react'
import { css } from 'glamor'

import { colors } from '@project-r/styleguide'

const styles = {
  warning: css({
    backgroundColor: colors.error,
    color: '#fff',
    marginBottom: 10,
    padding: 10,
  }),
}

export default ({ message }) => {
  return <div {...styles.warning}>{message}</div>
}

import React from 'react'
import { css, merge } from 'glamor'

import { mq } from './styles'

const styles = {
  image: css({
    position: 'relative',
    width: '100%'
  }),
  figure: css({
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 10
  }),
  floatLeft: css({
    [mq.medium]: {
      float: 'left',
      width: '50%',
      marginTop: 3,
      marginRight: 20
    }
  }),
  floatRight: css({
    [mq.medium]: {
      float: 'right',
      width: '50%',
      marginTop: 3,
      marginLeft: 20
    }
  })
}

export const Image = ({ data }) =>
  <img {...styles.image}
    src={data.src}
    alt={data.alt}
  />

export const Caption = ({ children, data }) => (
  <figcaption style={{
    textAlign: data.captionRight
      ? 'right'
      : 'left',
    fontSize: 12,
    fontFamily: 'sans-serif',
    margin: 0,
    position: 'relative'
  }}>
    {children}
  </figcaption>
)

export default ({ children, data }) => (
  <figure {...merge(
    styles.figure,
    data.float === 'left' && styles.floatLeft,
    data.float === 'right' && styles.floatRight
  )}>
    {children}
  </figure>
)
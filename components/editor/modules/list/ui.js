import React from 'react'
import { css } from 'glamor'
import { matchBlock, createBlockButton } from '../../utils'
import injectBlock from '../../utils/injectBlock'
import { LIST } from './constants'
import styles from '../../styles'
import { newBlock } from './'

const makeButton = ({ordered, label}) => createBlockButton({
  type: LIST,
  reducer: props =>
    event => {
      const { onChange, state } = props
      event.preventDefault()

      const inList = state.document.getClosest(state.startBlock.key, matchBlock(LIST))

      if (inList) {
        return onChange(
          state
            .change()
            .setNodeByKey(inList.key, {
              data: inList.data.merge({
                ordered
              })
            })
        )
      }

      return onChange(
        state
          .change()
          .call(
            injectBlock,
            newBlock({ordered})
          )
      )
    }
})(
  ({ active, disabled, visible, ...props }) =>
    <span
      {...{...css(styles.blockButton), ...props}}
      data-active={active}
      data-disabled={disabled}
      data-visible={visible}
      >
      {label}
    </span>
)

export const ULButton = makeButton({
  ordered: false,
  label: 'UL'
})

export const OLButton = makeButton({
  ordered: true,
  label: 'OL'
})
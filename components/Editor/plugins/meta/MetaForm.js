import React, { Component } from 'react'
import { css } from 'glamor'

import { Field, Checkbox } from '@project-r/styleguide'
import AutosizeInput from 'react-textarea-autosize'
import MaskedInput from 'react-maskedinput'

import { timeParse, timeFormat } from 'd3-time-format'

import withT from '../../../../lib/withT'

import ImageInput from '../../base/components/ImageInput'

const dateFormat = '%d.%m.%Y %H:%M'
const dateMask = dateFormat
  .replace('%Y', '1111')
  .replace(/%(d|m|H|M)/g, '11')
const parseDate = timeParse(dateFormat)
const formatDate = timeFormat(dateFormat)

const defaultGetWidth = () => '100%'

const GUTTER = 20
const styles = {
  grid: css({
    clear: 'both',
    width: `calc(100% + ${GUTTER}px)`,
    margin: `0 -${GUTTER / 2}px`,
    ':after': {
      content: '""',
      display: 'table',
      clear: 'both'
    }
  }),
  span: css({
    float: 'left',
    paddingLeft: `${GUTTER / 2}px`,
    paddingRight: `${GUTTER / 2}px`,
    minHeight: 1,
    width: '50%'
  }),
  autoSize: css({
    minHeight: 40,
    paddingTop: '7px !important',
    paddingBottom: '6px !important'
  }),
  mask: css({
    '::placeholder': {
      color: 'transparent'
    },
    ':focus': {
      '::placeholder': {
        color: '#ccc'
      }
    }
  })
}

class Form extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }
  componentWillReceiveProps (nextProps) {
    const { data } = this.props
    const { data: nextData } = nextProps
    if (!nextData.equals(data)) {
      const { state } = this
      const nextState = {}
      nextData.map((value, key) => {
        const stateValue = state[key]
        if (stateValue && stateValue.value !== value) {
          nextState[key] = undefined
        }
      })
      this.setState(nextState)
    }
  }
  render () {
    const {
      t,
      onInputChange,
      data,
      getWidth = defaultGetWidth,
      black
    } = this.props

    return (
      <div {...styles.grid}>
        {data.map((value, key) => {
          const label = t(`metaData/field/${key}`, undefined, key)

          let input
          let formattedValue = value
          let onChange
          if (key.match(/image|src/i)) {
            input = <ImageInput
              label={label}
              src={value}
              onChange={onInputChange(key)} >
              Bild auswählen
            </ImageInput>
          } else if (typeof value === 'boolean') {
            input = <Checkbox checked={value || true} onChange={onInputChange(key)} black={black}>
              {label}
            </Checkbox>
          } else {
            let renderInput
            if (key.match(/description/i)) {
              renderInput = ({ ref, ...inputProps }) => (
                <AutosizeInput {...styles.autoSize}
                  {...inputProps}
                  inputRef={ref} />
              )
            } else if (key.match(/date/i)) {
              renderInput = ({ ref, ...inputProps }) => (
                <MaskedInput
                  {...inputProps}
                  {...styles.mask}
                  placeholderChar={'_'}
                  mask={dateMask} />
              )
              const dateValue = value instanceof Date
                ? value
                : (
                  parseDate(value) ||
                  (value && new Date(value))
                )
              formattedValue = this.state[key] !== undefined
                ? this.state[key].formatted
                : dateValue ? formatDate(dateValue) : ''

              onChange = (_, inputValue) => {
                const parsedValue = parseDate(inputValue) || ''
                this.setState({
                  [key]: {
                    formatted: inputValue,
                    value: parsedValue !== value
                      ? parsedValue
                      : value
                  }
                }, () => {
                  if (parsedValue !== value) {
                    onInputChange(key)(_, parsedValue)
                  }
                })
              }
            }
            input = <Field
              label={label}
              name={key}
              value={formattedValue}
              renderInput={renderInput}
              black={black}
              onChange={onChange || onInputChange(key)} />
          }
          return (
            <div
              key={key}
              {...styles.span}
              style={{ width: getWidth(key) }}>
              {input}
            </div>
          )
        }).toArray()}
      </div>
    )
  }
}

export default withT(Form)

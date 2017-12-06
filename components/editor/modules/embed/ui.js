import React from 'react'
import { Radio, Label } from '@project-r/styleguide'
import { createPropertyForm } from '../../utils'

export default ({ TYPE, editorOptions }) => {
  const isVideoBlock = block => block.type === 'EMBEDVIDEO'
  const { sizes = [] } = editorOptions || {}

  const VideoForm = createPropertyForm({
    isDisabled: ({ value }) => {
      return !value.blocks.some(isVideoBlock)
    }
  })(({ disabled, value, onChange }) => {
    if (disabled) {
      return null
    }
    return (
      <div>
        {value.blocks.filter(isVideoBlock).map((block, i) => {
          return (
            <div key={`video-${i}`}>
              {!!sizes.length && (
                <p style={{ margin: '10px 0' }}>
                  <Label
                    style={{ display: 'inline-block', marginBottom: '5px' }}
                  >
                    Grösse
                  </Label>
                  <br />
                  {sizes.map((size, i) => {
                    let checked = Object.keys(size.props).every(
                      key => block.data.get(key) === size.props[key]
                    )
                    return [
                      <Radio
                        key={`radio${i}`}
                        checked={checked}
                        onChange={event => {
                          event.preventDefault()
                          if (checked) return

                          let change = value.change().setNodeByKey(block.key, {
                            data: block.data.merge(size.props)
                          })

                          onChange(change)
                        }}
                      >
                        {size.label}
                      </Radio>,
                      <br key={`br${i}`} />
                    ]
                  })}
                </p>
              )}
            </div>
          )
        })}
      </div>
    )
  })

  return {
    forms: [VideoForm]
  }
}

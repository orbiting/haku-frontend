import React from 'react'
import { css } from 'glamor'
import {
  plainButtonRule,
  fontStyles,
  useColorContext
} from '@project-r/styleguide'
import {
  DevicePhoneIcon,
  DeviceTabletIcon,
  DeviceLaptopIcon,
  DeviceDesktopIcon
} from '../../lib/icons'

const styles = {
  container: css({
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  }),
  iconContainer: css({
    flex: '0 0 30%',
    minWidth: 80,
    padding: '16px 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }),
  containerInline: css({
    display: 'flex',
    justifyContent: 'center'
  }),
  iconContainerInline: css({
    flex: 'none',
    padding: '4px 4px',
    margin: '0 8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }),
  label: css({
    ...fontStyles.sansSerifRegular12,
    marginTop: 4
  })
}

const screenSizes = [
  {
    name: 'phone',
    label: 'Mobile',
    Icon: DevicePhoneIcon
  },
  {
    name: 'tablet',
    label: 'Tablet',
    Icon: DeviceTabletIcon
  },
  {
    name: 'laptop',
    label: 'Laptop',
    Icon: DeviceLaptopIcon
  },
  {
    name: 'desktop',
    label: 'Desktop',
    Icon: DeviceDesktopIcon
  }
]

const ScreenSizePicker = ({ onSelect, selectedScreenSize, inline }) => {
  const [colorScheme] = useColorContext()

  return (
    <>
      <div {...(inline ? styles.containerInline : styles.container)}>
        {screenSizes.map(size => {
          const isSelected = selectedScreenSize === size.name
          return (
            <button
              key={size.name}
              {...colorScheme.set(
                'backgroundColor',
                isSelected ? 'text' : 'none'
              )}
              {...(inline ? styles.iconContainerInline : styles.iconContainer)}
              {...plainButtonRule}
              onClick={() => onSelect(size.name)}
            >
              <size.Icon
                {...colorScheme.set('fill', isSelected ? 'default' : 'text')}
                size={inline ? 18 : 24}
              />
              {!inline ? (
                <span
                  {...colorScheme.set('color', isSelected ? 'default' : 'text')}
                  {...styles.label}
                >
                  {size.label}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </>
  )
}

export default ScreenSizePicker

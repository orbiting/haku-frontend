import React from 'react'
import { useColorContext, plainButtonRule } from '@project-r/styleguide'
import { DarkmodeIcon } from '../../lib/icons'

function DarkmodeToggle({ previewDarkmode, onToggle }) {
  const [colorScheme] = useColorContext()
  return (
    <button {...plainButtonRule} onClick={() => onToggle()}>
      <DarkmodeIcon {...colorScheme.set('fill', 'text')} size={24} />
    </button>
  )
}

export default DarkmodeToggle

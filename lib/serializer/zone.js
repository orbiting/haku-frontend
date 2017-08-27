// Inspired by https://github.com/gut-leben-in-deutschland/bericht/blob/master/cabinet/markdown/mdast-zone.js and https://github.com/wooorm/mdast-zone/blob/10ec59489d045535742ce99f6f5692efbccf7038/index.js

module.exports.collapse = ({test, mutate}) => {
  const collectZones = (parent) => {
    if (!parent.children || parent.children.length === 0) {
      return parent
    }

    const collected = parent.children.reduce((result, child) => {
      const type = test(child)
      if (!result.start) {
        // not in a zone
        if (type === 'start') {
          result.start = child
        }
      } else if (type === 'end') {
        // in a zone, remeber end
        result.end = child
      }
      return result
    }, {})

    if (collected.end) {
      const children = parent.children
      const startI = children.indexOf(collected.start)
      const endI = children.indexOf(collected.end)
      const zoneChildren = children.slice(startI + 1, endI)

      const zone = mutate(
        collected.start,
        zoneChildren,
        collected.end
      )
      // collect nested zones
      collectZones(zone)

      // replace old children
      children.splice(
        startI,
        endI - startI + 1,
        zone
      )
    } else if (collected.start) {
      console.error(collected.start)
      throw Error('zone not ended')
    }

    return parent
  }

  return collectZones
}

module.exports.expand = ({test, mutate}) => {
  const expandZone = (parent) => {
    if (!parent.children || parent.children.length === 0) {
      return parent
    }

    parent.children = parent.children.reduce(
      (children, child) => {
        const expanded = expandZone(child)
        return children.concat(
          test(child)
            ? mutate(expanded)
            : expanded
        )
      },
      []
    )
    return parent
  }
  return expandZone
}
import React from 'react'

const CopyBtn = props => (
  <svg width={26} height={30} fill='none' {...props}>
    <rect
      x={4.5}
      y={0.5}
      width={21}
      height={25}
      rx={2.5}
      fill='#CCD3FF'
      stroke='#0025FF'
    />
    <rect
      x={0.5}
      y={4.5}
      width={21}
      height={25}
      rx={2.5}
      fill='#CCD3FF'
      stroke='#0025FF'
    />
  </svg>
)

export default CopyBtn

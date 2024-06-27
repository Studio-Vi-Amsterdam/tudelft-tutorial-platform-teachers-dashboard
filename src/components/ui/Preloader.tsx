import React from 'react'
import { TUDelftLogo } from './Icons'

interface PreloaderProps {
  color: 'primary' | 'secondary'
}

const Preloader = (props: PreloaderProps) => {
  const color =
    props.color === 'primary'
      ? { primary: '#00A6D6', secondary: 'white' }
      : { primary: '#00A6D6', secondary: 'black' }
  return (
    <div className="preloader">
      <div className="loaderContainer height100">
        <div className="ldsEllipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <TUDelftLogo color={color.primary} secondary={color.secondary} height="20" />
      </div>
    </div>
  )
}

export default Preloader

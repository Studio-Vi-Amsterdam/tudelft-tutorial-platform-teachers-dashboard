import React from 'react'

interface TipProps {
  children: React.ReactNode
}

const Tip = (props: TipProps) => {
  return (
    <div className="relative flex w-full flex-col rounded-[4px] border border-secondary-cornYellow bg-tertiary-cornYellow py-4 pl-14 pr-4 text-sm before:absolute before:left-4 before:top-4 before:h-6 before:w-6 before:bg-lamp before:bg-contain before:bg-center before:bg-no-repeat">
      {props.children}
    </div>
  )
}

export default Tip

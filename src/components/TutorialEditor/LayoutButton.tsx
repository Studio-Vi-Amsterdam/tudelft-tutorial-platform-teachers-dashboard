import React from 'react'
import { LayoutChapterType } from 'src/types/types'

interface LayoutButtonProps {
  layoutType: LayoutChapterType
  onClick: () => void
}

const LayoutButton = (props: LayoutButtonProps) => {
  const { layoutType, onClick } = props
  const isColumn = layoutType === '1 column'
  const isRowReverse = layoutType.split(' ')[1] === 'left'
  const isVideo = layoutType.split(' ')[0] === 'video'

  return (
    <button onClick={onClick} className="flex w-[184px] sm:w-1/4 flex-col items-start gap-y-1">
      <div
        className={`flex w-full gap-x-2 gap-y-2 rounded-[4px] border-[2px] border-tertiary-grey-stone p-2 ${
          isColumn ? 'flex-col' : isRowReverse ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {isColumn ? (
          <div className="w-full h-[72px] flex flex-col gap-y-2 [&>div]:w-full [&>div]:h-full [&>div]:bg-tertiary-grey-stone">
            <div></div>
            <div></div>
          </div>
        ) : (
          <>
            <div className="flex h-[72px] w-1/2 flex-col justify-between [&>div]:h-[6px] [&>div]:w-full [&>div]:bg-tertiary-grey-stone">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className="flex h-[72px] w-1/2 items-center justify-center bg-tertiary-grey-stone">
              {isVideo && <div className="h-4 w-[13px] bg-play bg-center bg-no-repeat"></div>}
            </div>
          </>
        )}
      </div>
      <p className="text-sm text-tertiary-grey-dim">{layoutType}</p>
    </button>
  )
}

export default LayoutButton

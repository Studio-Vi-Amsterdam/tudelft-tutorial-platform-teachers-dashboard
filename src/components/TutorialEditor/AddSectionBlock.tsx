import React, { useState } from 'react'
import { LayoutChapterType } from 'src/types/types'
import { Button } from '../ui/Button'

interface AddSectionBlockProps {
  articleType?: string | null
  variant:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'dashed'
    | 'elements'
    | null
    | undefined
  handleAddElement: (value: string, index?: number, subchapterIndex?: number) => void
  chapterIndex?: number
  subchapterIndex?: number
}

const AddSectionBlock = (props: AddSectionBlockProps) => {
  const [isSectionCreating, setIsSectionCreating] = useState<boolean>(false)

  const showChooseLayoutBlock = () => {
    setIsSectionCreating(true)
  }

  const sectionLayout: LayoutChapterType[] = [
    '1 column',
    'image left',
    'image right',
    'video left',
    'video right',
  ]

  const createSection = (layoutType: LayoutChapterType) => {
    setIsSectionCreating(false)
    props.handleAddElement(layoutType, props.chapterIndex, props.subchapterIndex)
  }

  return (
    <section className={'pt-8 relative flex w-full flex-col gap-y-6 '}>
      {isSectionCreating && (
        <div className="flex bg-seasalt flex-col gap-y-4 rounded-[8px] border-[2px] border-dashed border-tertiary-grey-dim py-6">
          <h4 className="text-center">Choose layout for the section</h4>
          <div className="flex flex-col max-sm:items-center sm:flex-row flex-wrap justify-center gap-10 gap-x-10 sm:gap-y-4">
            {sectionLayout.map((layoutType: LayoutChapterType, index: number) => (
              <button
                key={index}
                onClick={() => createSection(layoutType)}
                className="flex w-[184px] sm:w-1/4 flex-col items-start gap-y-1"
              >
                <div
                  className={`${
                    layoutType !== '1 column'
                      ? layoutType.split(' ')[1] === 'left'
                        ? 'flex-row-reverse'
                        : 'flex-row'
                      : 'flex-col'
                  } flex w-full gap-x-2 gap-y-2 rounded-[4px] border-[2px] border-tertiary-grey-stone p-2`}
                >
                  {layoutType === '1 column' ? (
                    <>
                      <div className="h-8 w-full bg-tertiary-grey-stone"></div>
                      <div className="h-8 w-full bg-tertiary-grey-stone"></div>
                    </>
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
                        {layoutType.split(' ')[0] === 'video' && (
                          <div className="h-4 w-[13px] bg-play bg-center bg-no-repeat"></div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <p className="text-sm text-tertiary-grey-dim">{layoutType}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <Button
        variant={props.variant}
        className={props.variant === 'outline' ? 'max-w-[190px]' : ''}
        onClick={showChooseLayoutBlock}
      >
        <div>+</div>
        {props.variant === 'dashed' ? <p>Add subchapter</p> : <p>Add section</p>}
      </Button>
    </section>
  )
}

export default AddSectionBlock

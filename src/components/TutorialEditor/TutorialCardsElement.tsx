import React, { useState } from 'react'
import { addTutorialCard, changeTutorialCard } from 'src/redux/features/editorSlice'
import { useAppDispatch } from 'src/redux/hooks'
import { TutorialCardInterface } from 'src/types/types'
import { Button } from '../ui/Button'

interface TutorialCarsElementProps {
  tutorialCards: TutorialCardInterface[]
  chapterIndex: number | undefined
  index: number
  block: string
}

const TutorialCardsElement = (props: TutorialCarsElementProps) => {
  const { tutorialCards, chapterIndex, index, block } = props
  const dispatch = useAppDispatch()

  const [checkedCustomTutorialCard, setCheckedCustomTutorialCard] = useState(
    tutorialCards.map((item) => item.value.url !== undefined),
  )

  const handleSelectTutorialCard = (
    value: string,
    block: string,
    listIndex: number,
    isUrl: boolean,
    nestedIndex: number,
    chapterIndex?: number,
    name?: string,
  ) => {
    dispatch(
      changeTutorialCard({ value, block, listIndex, nestedIndex, isUrl, chapterIndex, name }),
    )
  }

  const handleChangeCustomTutorialCard = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newChecked = [...checkedCustomTutorialCard]
    newChecked[index] = e.target.checked
    setCheckedCustomTutorialCard(newChecked)
  }

  const handleAddTutorialCardToGroup = (
    block: string,
    listIndex: number,
    chapterIndex?: number,
  ) => {
    dispatch(addTutorialCard({ block, listIndex, chapterIndex }))
  }

  return (
    <div className="flex w-full flex-col items-start justify-between gap-5 bg-transparent pt-10">
      {tutorialCards.map((el, nestedIndex) => (
        <div key={nestedIndex} className="flex w-full flex-row items-center justify-between gap-2">
          <div className="min-w-[104px] max-w-[104px]">Tutorial</div>
          <div className="w-9/12">
            <label className="flex flex-row gap-x-3 mb-3 items-center">
              <input
                type="checkbox"
                name={`use-custom-url-${chapterIndex}-${index}-${nestedIndex}`}
                checked={checkedCustomTutorialCard[nestedIndex] || false}
                onChange={(e) => handleChangeCustomTutorialCard(e, nestedIndex)}
                className="w-6 h-6 border-2 bg-white rounded-sm border-stone after:!bg-primary-skyBlue after:!border-primary-skyBlue after:!opacity-90 after:!bg-check after:!bg-center after:!bg-no-repeat"
              />
              Use custom url
            </label>
            {!checkedCustomTutorialCard[nestedIndex] ? (
              <select
                value={el.value.title}
                className="w-full rounded-[4px] border border-DIM bg-background-seasalt p-4 text-tertiary-grey-stone"
                onChange={(e) =>
                  handleSelectTutorialCard(
                    e.target.value,
                    block,
                    index,
                    false,
                    nestedIndex,
                    chapterIndex,
                  )
                }
              >
                <option value="">Choose tutorial</option>
                {el.proposedList &&
                  el.proposedList.map((listItem, idx) => (
                    <option key={idx} value={listItem.title}>
                      {listItem.title}
                    </option>
                  ))}
              </select>
            ) : (
              <div className="flex flex-col gap-y-3">
                <input
                  type="text"
                  className="w-full p-4 rounded border placeholder:text-[#96969B] text-base bg-seasalt border-dim"
                  value={el.value.title}
                  placeholder="Title"
                  onChange={(e) =>
                    handleSelectTutorialCard(
                      e.target.value,
                      block,
                      index,
                      true,
                      nestedIndex,
                      chapterIndex,
                      'title',
                    )
                  }
                />
                <input
                  type="text"
                  className="w-full p-4 rounded border placeholder:text-[#96969B] text-base bg-seasalt border-dim"
                  value={el.value.url}
                  placeholder="Url"
                  onChange={(e) =>
                    handleSelectTutorialCard(
                      e.target.value,
                      block,
                      index,
                      true,
                      nestedIndex,
                      chapterIndex,
                      'url',
                    )
                  }
                />
              </div>
            )}
          </div>
        </div>
      ))}
      <Button
        variant={'dashed'}
        onClick={() => handleAddTutorialCardToGroup(block, index, chapterIndex)}
      >
        <div>+</div>
        <p>Add Card</p>
      </Button>
    </div>
  )
}

export default TutorialCardsElement

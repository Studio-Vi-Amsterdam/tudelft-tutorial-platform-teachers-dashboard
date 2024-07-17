import React, { useState } from 'react'
import { Button } from 'src/components/ui/Button'

interface AddElementBlockProps {
  elements: Array<string>
  handleAddElement: (value: string, index?: number, subchapterIndex?: number) => void
  index?: number
  subchapterIndex?: number
}

const AddElementBlock = (props: AddElementBlockProps) => {
  const [addElementsActive, setAddElementsActive] = useState<boolean>(false)
  const { elements, subchapterIndex } = props

  const handleAddTutorialElementClick = (): void => {
    if (addElementsActive) {
      setAddElementsActive(false)
    } else {
      setAddElementsActive(true)
    }
  }

  const handleAddElement = (el: string) => {
    setAddElementsActive(false)
    props.handleAddElement(el, props?.index, subchapterIndex)
  }

  return (
    <div className="sm:flex w-full flex-row sm:gap-6 grid grid-cols-2 gap-2">
      <div className="sm:w-1/3 whitespace-nowrap">
        <Button className="max-sm:px-4" variant={'outline'} onClick={handleAddTutorialElementClick}>
          <div>+</div>
          <p>Add element</p>
        </Button>
      </div>
      {addElementsActive && (
        <div className="flex flex-row flex-wrap gap-x-2 gap-y-2">
          {elements.map((el, index) => (
            <Button
              className="sm:justify-center !px-6 !text-left !justify-start !items-start"
              variant={'elements'}
              key={index}
              onClick={() => handleAddElement(el)}
            >
              <p className="capitalize">{el}</p>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddElementBlock

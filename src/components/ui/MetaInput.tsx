import React from 'react'
import {
  EditorBelongsInterface,
  ObjectNameType,
  TutorialResponsibleInterface,
} from 'src/types/types'

interface MetaInputProps {
  value: string
  handleChange: (
    value: string,
    objectName: ObjectNameType,
    belongsKeyName?: keyof EditorBelongsInterface,
    responsibleKeyName?: keyof TutorialResponsibleInterface,
  ) => void
  placeholder: string
  objectName: ObjectNameType
  belongsKeyName?: keyof EditorBelongsInterface
  responsibleKeyName?: keyof TutorialResponsibleInterface
}

const MetaInput = (props: MetaInputProps) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        className={
          'w-full rounded-[4px] border border-inputBorder bg-background-seasalt px-2 py-[10px] text-xl leading-8 placeholder:text-tertiary-grey-stone'
        }
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) =>
          props.handleChange(
            e.target.value,
            props.objectName,
            props.belongsKeyName ? props.belongsKeyName : undefined,
            props?.responsibleKeyName,
          )
        }
      />
    </div>
  )
}

export default MetaInput

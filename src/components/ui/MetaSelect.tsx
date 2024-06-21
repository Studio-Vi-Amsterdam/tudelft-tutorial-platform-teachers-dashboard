import React from 'react'
import {
  EditorBelongsInterface,
  IdTitleObject,
  ObjectNameType,
  TutorialResponsibleInterface,
} from 'src/types/types'

interface MetaSelectProps {
  objectType: ObjectNameType
  belongsKeyName?: keyof EditorBelongsInterface
  responsibleKeyName?: keyof TutorialResponsibleInterface
  handleMetaInputChange: (
    value: string | IdTitleObject | undefined,
    objectName: ObjectNameType,
    belongsKeyName?: keyof EditorBelongsInterface,
    responsibleKeyName?: keyof TutorialResponsibleInterface,
  ) => void
  selectValue: string | IdTitleObject
  fieldTitle: string
  options: IdTitleObject[] | string[] | [] | undefined
}

const MetaSelect = (props: MetaSelectProps) => {
  return (
    <select
      value={typeof props.selectValue === 'string' ? props.selectValue : props.selectValue.title}
      className="w-full rounded-[4px] border border-inputBorder bg-background-seasalt px-2 py-[10px] text-xl leading-8 placeholder:text-tertiary-grey-stone"
      onChange={(e) =>
        props.handleMetaInputChange(
          e.target.value,
          props.objectType,
          props?.belongsKeyName,
          props.responsibleKeyName,
        )
      }
    >
      <option value="">{props.fieldTitle}</option>
      {props.options &&
        props.options.map((listItem, index) => (
          <option key={index} value={typeof listItem === 'string' ? listItem : listItem.title}>
            {typeof listItem === 'string' ? listItem : listItem.title}
          </option>
        ))}
    </select>
  )
}

export default MetaSelect

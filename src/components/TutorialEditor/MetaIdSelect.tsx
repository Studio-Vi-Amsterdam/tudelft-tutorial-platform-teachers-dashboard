import React from 'react'
import { MetaFieldIdListInterface, ObjectNameType } from '@/types/types'

interface MetaIdSelectProps {
  selectedObject: MetaFieldIdListInterface
  keyName: 'primary' | 'version' | 'primarySubject' | 'secondarySubject' | 'course'
  objectName: ObjectNameType
  handleMetaInputChange: (
    value: string,
    objectName: ObjectNameType,
    belongsKeyName?: 'primary' | 'version' | 'primarySubject' | 'secondarySubject' | 'course',
  ) => void
}

const MetaIdSelect = (props: MetaIdSelectProps) => {
  return (
    <select
      value={props.selectedObject.value?.title}
      className="w-full p-4 rounded-sm text-[#96969B] border text-base bg-seasalt border-dim"
      onChange={(e) => props.handleMetaInputChange(e.target.value, props.objectName, props.keyName)}
    >
      <option value="">{props.selectedObject.fieldTitle}</option>
      {props.selectedObject.list &&
        props.selectedObject.list.map((listItem, index) => (
          <option key={index} value={listItem?.title}>
            {listItem?.title}
          </option>
        ))}
    </select>
  )
}

export default MetaIdSelect

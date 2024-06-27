import React from 'react'

interface TextInputProps {
  value: string
  handleChange: (value: string, index?: number, subchapterIndex?: number) => void
  placeholder: string
  headingType?: string
  index?: number
  subchapterIndex?: number
  readonly?: boolean
  className?: string
  element?: 'textarea'
}

const TextInput = (props: TextInputProps) => {
  // This switch/case for future fucntionality
  const getHeadingType = (): string | undefined => {
    switch (props?.headingType) {
      case 'h1':
        return 'Title / H1'
      case 'h2':
        return 'H2'
      case 'h3':
        return 'H3'
      case 'h4':
        return 'H4'
      case 'h5':
        return 'H5'
      case 'h6':
        return 'H6'
      default:
        return undefined
    }
  }

  return props?.element === 'textarea' ? (
    <div className="relative w-full">
      <textarea
        className={`${props.className} ${
          props?.headingType && 'pr-24'
        } w-full rounded-[4px] border border-inputBorder  p-2 resize-none h-28 leading-8 placeholder:text-tertiary-grey-stone`}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.handleChange(e.target.value, props?.index, props?.subchapterIndex)}
        readOnly={props?.readonly}
      />
      {props?.headingType && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-[4px] border border-tertiary-grey-stone bg-tertiary-grey-silver px-3 py-2 text-sm text-tertiary-grey-dim">
          {getHeadingType()}
        </div>
      )}
    </div>
  ) : (
    <div className="relative w-full">
      <input
        type="text"
        className={`${props.className} ${
          props?.headingType && 'pr-24'
        } w-full rounded-[4px] border border-inputBorder bg-background-seasalt px-2 py-[10px] text-xl leading-8 placeholder:text-tertiary-grey-stone`}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.handleChange(e.target.value, props?.index, props?.subchapterIndex)}
        readOnly={props?.readonly}
      />
      {props?.headingType && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-[4px] border border-tertiary-grey-stone bg-tertiary-grey-silver px-3 py-2 text-sm text-tertiary-grey-dim">
          {getHeadingType()}
        </div>
      )}
    </div>
  )
}

export default TextInput

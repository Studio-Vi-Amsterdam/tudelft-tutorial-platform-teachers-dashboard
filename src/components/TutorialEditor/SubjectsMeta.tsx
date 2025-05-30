import React from 'react'
import EditorLabel from '../ui/EditorLabel'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import { changeSubjectsIdListField } from 'src/redux/features/editorSlice'

const SubjectsMeta = () => {
  const errValidationStyle = 'border border-red-500 rounded-sm'

  const belongsFields = useAppSelector((state: RootState) => state.editor.meta.subjectsInvolve)
  const dispatch = useAppDispatch()
  const handleMetaIdInputChange = (
    value: string,
    involvesKeyName: 'primaryCategory' | 'secondaryCategory',
  ) => {
    if (involvesKeyName) {
      dispatch(changeSubjectsIdListField({ value, involvesKeyName }))
    }
  }
  return (
    <>
      <section className="relative flex w-full flex-col gap-y-6 py-14 sm:py-20 before:absolute before:left-0 before:top-0 before:h-[2px] before:w-full before:bg-tertiary-grey-silver">
        <EditorLabel>
          Filling in the subject mandatory to ensure the right navigation. If this tutorial also
          belongs to a course and software, please also fill that in. This information won’t be
          displayed, but used to place the tutorial in the right place in the sitemap.
        </EditorLabel>
        <h3 className="font-bold">What subject does this involve?</h3>
        <div className="flex flex-col gap-y-8">
          {belongsFields && (
            <>
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <div className="min-w-[104px] max-w-[104px]">{`${belongsFields.primaryCategory.fieldTitle}${
                  belongsFields.primaryCategory.required ? '*' : ''
                }`}</div>
                <div
                  className={`w-9/12 ${!belongsFields.primaryCategory.isValid && errValidationStyle}`}
                >
                  <select
                    value={belongsFields.primaryCategory.value.title}
                    className="w-full rounded-[4px] border border-DIM bg-background-seasalt p-4  text-tertiary-grey-stone"
                    onChange={(e) => handleMetaIdInputChange(e.target.value, 'primaryCategory')}
                  >
                    <option value="">{belongsFields.primaryCategory.fieldTitle}</option>
                    {belongsFields.primaryCategory.list &&
                      belongsFields.primaryCategory.list.map((listItem, index) => (
                        <option key={index} value={listItem?.title}>
                          {listItem?.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <div className="min-w-[104px] max-w-[104px]">{`${belongsFields.secondaryCategory.fieldTitle}${
                  belongsFields.secondaryCategory.required ? '*' : ''
                }`}</div>
                <div
                  className={`w-9/12 ${!belongsFields.secondaryCategory.isValid && errValidationStyle}`}
                >
                  <select
                    value={belongsFields.secondaryCategory.value.title}
                    className="w-full rounded-[4px] border border-DIM bg-background-seasalt p-4  text-tertiary-grey-stone"
                    onChange={(e) => handleMetaIdInputChange(e.target.value, 'secondaryCategory')}
                  >
                    <option value="">{belongsFields.secondaryCategory.fieldTitle}</option>
                    {belongsFields.secondaryCategory.list &&
                      belongsFields.secondaryCategory.list.map((listItem, index) => (
                        <option key={index} value={listItem?.title}>
                          {listItem?.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}

export default SubjectsMeta

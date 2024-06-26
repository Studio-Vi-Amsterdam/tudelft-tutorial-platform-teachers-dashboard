import React from 'react'
import EditorLabel from '../ui/EditorLabel'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import { TutorialMetaObject } from 'src/types/types'
import { changeMetaField } from 'src/redux/features/editorSlice'

const SubjectsMeta = () => {
  const belongsFields = useAppSelector((state: RootState) => state.editor.meta.subjectsInvolve)
  const dispatch = useAppDispatch()
  const handleChangeInput = (
    value: string,
    objectName: keyof TutorialMetaObject,
    subjectInvolveKey: 'primaryCategory' | 'secondaryCategory',
  ) => {
    dispatch(
      changeMetaField({
        value,
        objectName,
        subjectInvolveKey,
      }),
    )
  }
  return (
    <>
      <section className="relative flex w-full flex-col gap-y-6 py-20 before:absolute before:left-0 before:top-0 before:h-[2px] before:w-full before:bg-tertiary-grey-silver">
        <EditorLabel>
          Filling in the subject mandatory to ensure the right navigation. If this tutorial also
          belongs to a course ans software, please also fill that in. This information won’t be
          displayed, but used to place the tutorial in the right place in the sitemap.
        </EditorLabel>
        <h3 className="font-bold">What subject does this involve?</h3>
        <div className="flex flex-col gap-y-8">
          {belongsFields && (
            <>
              <div className="flex w-full flex-row items-center justify-between">
                <div>{`${belongsFields.primaryCategory.fieldTitle}${
                  belongsFields.primaryCategory.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <input
                    value={belongsFields.primaryCategory.value}
                    placeholder={belongsFields.primaryCategory.fieldTitle}
                    onChange={(e) =>
                      handleChangeInput(e.target.value, 'subjectsInvolve', 'primaryCategory')
                    }
                  />
                </div>
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <div>{`${belongsFields.secondaryCategory.fieldTitle}${
                  belongsFields.secondaryCategory.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <input
                    value={belongsFields.secondaryCategory.value}
                    placeholder={belongsFields.secondaryCategory.fieldTitle}
                    onChange={(e) =>
                      handleChangeInput(e.target.value, 'subjectsInvolve', 'secondaryCategory')
                    }
                  />
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

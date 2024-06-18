import React, { useEffect, useState } from 'react'
import EditorLabel from '../ui/EditorLabel'
import {
  EditorBelongsInterface,
  ObjectNameType,
  TutorialResponsibleInterface,
} from 'src/types/types'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import {
  addKeywordsToList,
  addKeywordsToProposed,
  addTeacherToList,
  addTeacherToProposed,
  changeMetaField,
  changeMetaListIdValue,
  deleteKeyword,
  deleteTeacher,
  removeKeywordFromProposed,
  removeTeacherFromProposed,
} from 'src/redux/features/editorSlice'
import MetaInput from '../ui/MetaInput'
import MetaSelect from '../ui/MetaSelect'
import { Button } from '../ui/Button'
import TextInput from '../ui/TextInput'
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog'
import { taxonomiesAPI } from 'src/lib/api'
import MetaIdSelect from './MetaIdSelect'

const TutorialsMeta = () => {
  const [belongsKeys, setBelongsKeys] = useState<Array<keyof EditorBelongsInterface> | undefined>(
    undefined,
  )
  const [responsibleKeys, setResponsibleKeys] = useState<
    Array<keyof TutorialResponsibleInterface> | undefined
  >(undefined)

  const belongsFields = useAppSelector((state: RootState) => state.editor.meta.tutorialBelongs)
  const responsibleFields = useAppSelector(
    (state: RootState) => state.editor.meta.tutorialResponsible,
  )

  const dispatch = useAppDispatch()

  const state = useAppSelector((state: RootState) => state.editor)
  useEffect(() => {
    console.log(state)
  }, [state])

  const handleMetaInputTeachersChange = (value: string) => {
    dispatch(addTeacherToList({ value: value.split(';')[0], objectName: 'tutorialResponsible' }))
    dispatch(
      removeTeacherFromProposed({ value: value.split(';')[0], objectName: 'tutorialResponsible' }),
    )
    dispatch(
      changeMetaField({
        value: '',
        objectName: 'tutorialResponsible',
        belongsKeyName: undefined,
        responsibleKeyName: 'teachers',
      }),
    )
  }

  const handleMetaInputKeywordsChange = (
    value: string,
    objectName: ObjectNameType,
    belongsKeyName?: 'level' | 'image' | 'keywords',
    // responsibleKeyName?: keyof TutorialResponsibleInterface,
  ) => {
    if (value[value.length - 1] === ';') {
      dispatch(addKeywordsToList({ value: value.split(';')[0], objectName: 'tutorialBelongs' }))
      dispatch(
        removeKeywordFromProposed({ value: value.split(';')[0], objectName: 'tutorialBelongs' }),
      )
      dispatch(
        changeMetaField({
          value: '',
          objectName,
          belongsKeyName,
        }),
      )
    } else {
      dispatch(
        changeMetaField({
          value,
          objectName,
          belongsKeyName,
        }),
      )
    }
  }

  const handleMetaInputChange = (
    value: string,
    objectName: ObjectNameType,
    belongsKeyName?: 'level' | 'image',
    responsibleKeyName?: keyof TutorialResponsibleInterface,
  ) => {
    if (belongsKeyName) {
      dispatch(
        changeMetaField({
          value,
          objectName,
          belongsKeyName,
        }),
      )
    } else if (responsibleKeyName) {
      dispatch(
        changeMetaField({
          value,
          objectName,
          responsibleKeyName,
        }),
      )
    }
  }

  const handleMetaIdInputChange = (
    value: string,
    objectName: ObjectNameType,
    belongsKeyName?: 'primary' | 'version' | 'primarySubject' | 'secondarySubject',
  ) => {
    if (belongsKeyName) {
      dispatch(changeMetaListIdValue({ value, belongsKeyName }))
    }
  }

  const deleteKeywordFromList = (keyword: string) => {
    dispatch(deleteKeyword({ value: keyword, objectName: 'tutorialBelongs' }))
    dispatch(addKeywordsToProposed({ value: keyword, objectName: 'tutorialBelongs' }))
  }
  const deleteTeacherFromList = (teacher: string) => {
    dispatch(deleteTeacher({ value: teacher, objectName: 'tutorialResponsible' }))
    dispatch(addTeacherToProposed({ value: teacher, objectName: 'tutorialResponsible' }))
  }
  const keywordsArr: string[] | [] = useAppSelector((state: RootState) =>
    state.editor.meta.tutorialBelongs
      ? state.editor.meta.tutorialBelongs.keywords.proposedList
      : [],
  )
  useEffect(() => {
    setDisplayedKeywords(keywordsArr)
  }, [keywordsArr])

  const [displayedKeywords, setDisplayedKeywords] = useState<string[]>(keywordsArr)

  const handleTeacherInputChange = (teacher: string) => {
    dispatch(
      changeMetaField({
        value: teacher,
        objectName: 'tutorialResponsible',
        responsibleKeyName: 'teachers',
      }),
    )
  }
  const handleKeywordInputChange = (keyword: string) => {
    dispatch(
      changeMetaField({
        value: keyword,
        objectName: 'tutorialBelongs',
        belongsKeyName: 'keywords',
      }),
    )
    const newDisplayedValues = displayedKeywords
      .filter((item) => item.startsWith(keyword))
      .sort((a, b) => a.localeCompare(b))

    if (keyword === '') {
      setDisplayedKeywords(keywordsArr)
    } else {
      setDisplayedKeywords(newDisplayedValues)
    }
  }
  const handleKeywordSelect = (val: string) => {
    handleMetaInputKeywordsChange(val + ';', 'tutorialBelongs', 'keywords')
  }

  const handleTeacherSelect = (val: string) => {
    handleMetaInputTeachersChange(val + ';')
  }

  const [addKeywordDialogOpened, setAddKeywordDialogOpened] = useState<boolean>(false)

  useEffect(() => {
    if (belongsFields && responsibleFields) {
      setBelongsKeys(Object.keys(belongsFields) as Array<keyof EditorBelongsInterface>)
      setResponsibleKeys(
        Object.keys(responsibleFields) as Array<keyof TutorialResponsibleInterface>,
      )
    }
  }, [])

  const [isKeywordPostFetching, setIsKeywordPostFetching] = useState<boolean>(false)

  const handleCreateNewKeyword = async (keyword: string) => {
    setIsKeywordPostFetching(true)
    const response = await taxonomiesAPI.createKeyword(keyword).then((res) => res)
    if (response.status === 200) {
      setDisplayedKeywords([keyword, ...displayedKeywords])
      setIsKeywordPostFetching(false)
      setAddKeywordDialogOpened(false)
    }
  }
  return (
    <>
      <section className="relative flex w-full flex-col gap-y-6 py-20 before:absolute before:left-0 before:top-0 before:h-[2px] before:w-full before:bg-tertiary-grey-silver">
        <EditorLabel>
          Filling in the subject mandatory to ensure the right navigation. If this tutorial also
          belongs to a course ans software, please also fill that in. This information won’t be
          displayed, but used to place the tutorial in the right place in the sitemap.
        </EditorLabel>
        <h3 className="font-bold">This tutorial belongs to</h3>
        <div className="flex flex-col gap-y-8">
          {belongsFields && (
            <>
              <div className="flex w-full flex-row items-center justify-between">
                <div>{`${belongsFields.primary.fieldTitle}${
                  belongsFields.primary.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <MetaIdSelect
                    handleMetaInputChange={handleMetaIdInputChange}
                    keyName="primary"
                    objectName="tutorialBelongs"
                    selectedObject={belongsFields.primary}
                  />
                </div>
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <div>{`${belongsFields.version.fieldTitle}${
                  belongsFields.version.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <MetaIdSelect
                    handleMetaInputChange={handleMetaIdInputChange}
                    keyName="version"
                    objectName="tutorialBelongs"
                    selectedObject={belongsFields.version}
                  />
                </div>
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <div>{`${belongsFields.primarySubject.fieldTitle}${
                  belongsFields.primarySubject.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <MetaIdSelect
                    handleMetaInputChange={handleMetaIdInputChange}
                    keyName="primarySubject"
                    objectName="tutorialBelongs"
                    selectedObject={belongsFields.primarySubject}
                  />
                </div>
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <div>{`${belongsFields.secondarySubject.fieldTitle}${
                  belongsFields.secondarySubject.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <MetaIdSelect
                    handleMetaInputChange={handleMetaIdInputChange}
                    keyName="secondarySubject"
                    objectName="tutorialBelongs"
                    selectedObject={belongsFields.secondarySubject}
                  />
                </div>
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <div>{`${belongsFields.level.fieldTitle}${
                  belongsFields.level.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <select
                    value={belongsFields.level.value}
                    className="w-full rounded-[4px] border border-inputBorder bg-background-seasalt px-2 py-[10px] text-xl leading-8 placeholder:text-tertiary-grey-stone"
                    onChange={(e) =>
                      handleMetaInputChange(e.target.value, 'tutorialBelongs', 'level')
                    }
                  >
                    <option value="">{belongsFields.level.fieldTitle}</option>
                    {belongsFields.level.list &&
                      belongsFields.level.list.map((listItem, index) => (
                        <option key={index} value={listItem}>
                          {listItem}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <div>{`${belongsFields.keywords.fieldTitle}${
                  belongsFields.keywords.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <>
                    <div className="w-full">
                      <div className="relative mx-auto flex w-full flex-col gap-y-4 pt-4">
                        <div className="absolute right-0 top-0">
                          <Button
                            variant={'default'}
                            onClick={() => setAddKeywordDialogOpened(true)}
                          >
                            <div>+</div>
                          </Button>
                        </div>

                        <input
                          type="text"
                          placeholder="search keyword"
                          className="p-1"
                          value={belongsFields.keywords.value}
                          onChange={(e) => handleKeywordInputChange(e.target.value)}
                        />
                        <div
                          className={
                            ' flex max-h-28 w-full flex-col gap-y-2 overflow-y-auto border bg-white px-2 pb-2 [&>button]:py-2'
                          }
                        >
                          {displayedKeywords &&
                            displayedKeywords.map((item, index) => (
                              <button
                                className="w-full text-left hover:bg-tertiary-grey-silver"
                                key={index}
                                onClick={() => handleKeywordSelect(item)}
                              >
                                {item}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </>
                </div>
              </div>
              <div className="flex w-full flex-row justify-end">
                <div className="flex w-9/12 flex-row flex-wrap gap-x-2 gap-y-2 pt-4">
                  {belongsFields.keywords.list &&
                    belongsFields.keywords.list.map((keyword, index) => (
                      <button
                        key={index}
                        className="relative rounded-[4px] bg-tertiary-skyBlue-10 py-1 pl-2 pr-8 before:absolute before:right-2 before:top-1/2 before:h-4 before:w-4 before:-translate-y-1/2 before:bg-cross before:bg-center before:bg-no-repeat"
                        onClick={() => deleteKeywordFromList(keyword)}
                      >
                        {keyword}
                      </button>
                    ))}
                </div>
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <div>{`${belongsFields.image.fieldTitle}${
                  belongsFields.image.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <Button variant={'outline'}>
                    <div>+</div>
                    <p>Select image from media library</p>
                  </Button>
                </div>
              </div>
              <Dialog open={addKeywordDialogOpened} onOpenChange={setAddKeywordDialogOpened}>
                <DialogContent className="bg-white">
                  <EditorLabel>Create new keyword</EditorLabel>
                  <TextInput
                    placeholder="term"
                    value={belongsFields.keywords.value}
                    handleChange={(val: string) => handleKeywordInputChange(val)}
                  />
                  {[
                    ...belongsFields.keywords.list,
                    ...belongsFields.keywords.proposedList,
                  ].includes(belongsFields.keywords.value) && (
                    <p className="text-red-500">This keyword already exists</p>
                  )}
                  <DialogFooter>
                    <Button
                      disabled={
                        isKeywordPostFetching ||
                        !belongsFields.keywords.value ||
                        [
                          ...belongsFields.keywords.list,
                          ...belongsFields.keywords.proposedList,
                        ].includes(belongsFields.keywords.value)
                      }
                      onClick={() => handleCreateNewKeyword(belongsFields.keywords.value)}
                    >
                      <p>{isKeywordPostFetching ? '...' : 'Create'}</p>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
        <h3 className="font-bold">Responsible</h3>
        <div className="flex flex-col gap-y-8">
          {responsibleFields && (
            <>
              <div className="flex w-full flex-row items-center justify-between">
                <div>{`${responsibleFields.faculty.fieldTitle}${
                  responsibleFields.faculty.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <select
                    value={responsibleFields.faculty.value}
                    className="w-full rounded-[4px] border border-inputBorder bg-background-seasalt px-2 py-[10px] text-xl leading-8 placeholder:text-tertiary-grey-stone"
                    onChange={(e) =>
                      handleMetaInputChange(
                        e.target.value,
                        'tutorialResponsible',
                        undefined,
                        'faculty',
                      )
                    }
                  >
                    <option value="">{responsibleFields.faculty.fieldTitle}</option>
                    {responsibleFields.faculty.list &&
                      responsibleFields.faculty.list.map((listItem, index) => (
                        <option key={index} value={listItem}>
                          {listItem}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <div>{`${responsibleFields.teachers.fieldTitle}${
                  responsibleFields.teachers.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <>
                    <div className="w-full">
                      <div className="relative mx-auto flex w-full flex-col gap-y-4 pt-4">
                        <input
                          type="text"
                          placeholder="search teacher"
                          className="p-1"
                          value={responsibleFields.teachers.value}
                          onChange={(e) => handleTeacherInputChange(e.target.value)}
                        />
                        <div
                          className={
                            ' flex max-h-28 w-full flex-col gap-y-2 overflow-y-auto border bg-white px-2 pb-2 [&>button]:py-2'
                          }
                        >
                          {responsibleFields.teachers.proposedList &&
                            responsibleFields.teachers.proposedList.map((item, index) => (
                              <button
                                className="w-full text-left hover:bg-tertiary-grey-silver"
                                key={index}
                                onClick={() => handleTeacherSelect(item)}
                              >
                                {item}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </>
                </div>
              </div>
              <div className="flex w-full flex-row justify-end">
                <div className="flex w-9/12 flex-row flex-wrap gap-x-2 gap-y-2 pt-4">
                  {responsibleFields.teachers.list &&
                    responsibleFields.teachers.list.map((keyword, index) => (
                      <button
                        key={index}
                        className="relative rounded-[4px] bg-tertiary-skyBlue-10 py-1 pl-2 pr-8 before:absolute before:right-2 before:top-1/2 before:h-4 before:w-4 before:-translate-y-1/2 before:bg-cross before:bg-center before:bg-no-repeat"
                        onClick={() => deleteTeacherFromList(keyword)}
                      >
                        {keyword}
                      </button>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}

export default TutorialsMeta

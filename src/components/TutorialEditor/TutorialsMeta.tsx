import React, { useEffect, useState } from 'react'
import EditorLabel from '../ui/EditorLabel'
import { ObjectNameType, TutorialResponsibleInterface } from 'src/types/types'
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
import { Button } from '../ui/Button'
import TextInput from '../ui/TextInput'
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog'
import { taxonomiesAPI } from 'src/lib/api'
import MetaIdSelect from './MetaIdSelect'
import AddMediaElement from './AddMediaElement'

const TutorialsMeta = () => {
  const belongsFields = useAppSelector((state: RootState) => state.editor.meta.tutorialBelongs)
  const responsibleFields = useAppSelector(
    (state: RootState) => state.editor.meta.tutorialResponsible,
  )

  const dispatch = useAppDispatch()

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
    belongsKeyName?: 'primary' | 'version' | 'primarySubject' | 'secondarySubject' | 'course',
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
  const teachersArr: string[] | [] = useAppSelector((state: RootState) =>
    state.editor.meta.tutorialResponsible
      ? state.editor.meta.tutorialResponsible.teachers.proposedList
      : [],
  )

  useEffect(() => {
    setDisplayedTeachers(teachersArr)
  }, [teachersArr])
  useEffect(() => {
    setDisplayedKeywords(keywordsArr)
  }, [keywordsArr])

  const [displayedKeywords, setDisplayedKeywords] = useState<string[]>(keywordsArr)
  const [displayedTeachers, setDisplayedTeachers] = useState<string[]>(teachersArr)

  const handleTeacherInputChange = (teacher: string) => {
    dispatch(
      changeMetaField({
        value: teacher,
        objectName: 'tutorialResponsible',
        responsibleKeyName: 'teachers',
      }),
    )
    const newDisplayedValues = teachersArr
      .filter((item) => item.toLowerCase().startsWith(teacher.toLowerCase().trim()))
      .sort((a, b) => a.localeCompare(b))

    if (teacher === '') {
      setDisplayedTeachers(teachersArr)
    } else {
      setDisplayedTeachers(newDisplayedValues)
    }
  }

  const handleKeywordInputChange = (keyword: string) => {
    dispatch(
      changeMetaField({
        value: keyword,
        objectName: 'tutorialBelongs',
        belongsKeyName: 'keywords',
      }),
    )
    const newDisplayedValues = keywordsArr
      .filter((item) => item.toLowerCase().startsWith(keyword.toLowerCase().trim()))
      .sort((a, b) => a.localeCompare(b))

    if (keyword === '') {
      setDisplayedKeywords(keywordsArr)
    } else {
      setDisplayedKeywords(newDisplayedValues)
    }
  }
  const handleKeywordSelect = (val: string) => {
    handleMetaInputKeywordsChange(val + ';', 'tutorialBelongs', 'keywords')
    dispatch(
      changeMetaField({
        value: '',
        objectName: 'tutorialBelongs',
        belongsKeyName: 'keywords',
      }),
    )
  }

  const handleTeacherSelect = (val: string) => {
    handleMetaInputTeachersChange(val + ';')
    dispatch(
      changeMetaField({
        value: '',
        objectName: 'tutorialResponsible',
        responsibleKeyName: 'teachers',
      }),
    )
  }

  const [addKeywordDialogOpened, setAddKeywordDialogOpened] = useState<boolean>(false)
  const [isKeywordPostFetching, setIsKeywordPostFetching] = useState<boolean>(false)
  const [showDropdown, setShowDropdown] = useState<boolean>(true)
  const [showDropdownTeacher, setShowDropdownTeacher] = useState<boolean>(true)

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
      <section className="relative flex w-full flex-col gap-y-6 py-14 sm:py-20 before:absolute before:left-0 before:top-0 before:h-[2px] before:w-full before:bg-tertiary-grey-silver">
        <EditorLabel>
          Filling in the subject mandatory to ensure the right navigation. If this tutorial also
          belongs to a course ans software, please also fill that in. This information won’t be
          displayed, but used to place the tutorial in the right place in the sitemap.
        </EditorLabel>
        <h3 className="font-bold">This tutorial belongs to</h3>
        <div className="flex flex-col gap-y-8">
          {belongsFields && (
            <>
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <div className="min-w-[104px] max-w-[104px]">{`${belongsFields.course.fieldTitle}${
                  belongsFields.course.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <MetaIdSelect
                    handleMetaInputChange={handleMetaIdInputChange}
                    keyName="course"
                    objectName="tutorialBelongs"
                    selectedObject={belongsFields.course}
                  />
                </div>
              </div>
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <div className="min-w-[104px] max-w-[104px]">{`${belongsFields.primary.fieldTitle}${
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
              {belongsFields.version.list.length > 0 && (
                <div className="flex w-full flex-row items-center justify-between gap-2">
                  <div className="min-w-[104px] max-w-[104px]">{`${belongsFields.version.fieldTitle}${
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
              )}
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <div className="min-w-[104px] max-w-[104px]">{`${belongsFields.primarySubject.fieldTitle}${
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
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <div className="min-w-[104px] max-w-[104px]">{`${belongsFields.secondarySubject.fieldTitle}${
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
              {/* <div className="flex w-full flex-row items-center justify-between">
                <div>{`${belongsFields.level.fieldTitle}${
                  belongsFields.level.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <input
                    type="text"
                    value={belongsFields.level.value}
                    onChange={(e) =>
                      handleMetaInputChange(e.target.value, 'tutorialBelongs', 'level')
                    }
                  />
                </div>
              </div> */}
              <div className="flex w-full flex-row items-start justify-between gap-2">
                <div className="h-14 flex items-center min-w-[104px] max-w-[104px]">{`${belongsFields.keywords.fieldTitle}${
                  belongsFields.keywords.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <div className="relative mx-auto flex w-full  sm:gap-x-4 gap-1">
                    <div className="grow relative z-10">
                      <input
                        type="text"
                        placeholder="search keyword"
                        className="w-full p-4 rounded placeholder:text-[#96969B] border text-base bg-seasalt border-dim"
                        value={belongsFields.keywords.value}
                        onChange={(e) => handleKeywordInputChange(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() =>
                          setTimeout(() => {
                            setShowDropdown(false)
                          }, 100)
                        }
                      />
                      {showDropdown &&
                        displayedKeywords.length > 0 &&
                        belongsFields.keywords.value.length > 0 && (
                          <div
                            className={
                              ' absolute top-full w-full rounded left-0 flex max-h-28 w-full flex-col gap-y-2 overflow-y-auto border bg-seasalt border-dim  [&>button]:py-2'
                            }
                          >
                            {displayedKeywords &&
                              displayedKeywords.map((item, index) => (
                                <button
                                  className="w-full text-left hover:bg-tertiary-grey-silver px-4"
                                  key={index}
                                  onClick={() => handleKeywordSelect(item)}
                                >
                                  {item}
                                </button>
                              ))}
                          </div>
                        )}
                    </div>
                    <div className="h-[58px]">
                      <Button
                        className="h-full flex items-center"
                        variant={'default'}
                        onClick={() => setAddKeywordDialogOpened(true)}
                      >
                        <div>+</div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {belongsFields.keywords.list.length > 0 && (
                <div className="flex w-full flex-row justify-end">
                  <div className="flex sm:w-9/12 w-[calc(100%-112px)] sm:flex-row flex-col max-sm:items-start flex-wrap gap-x-2 gap-y-2">
                    {belongsFields.keywords.list.map((keyword, index) => (
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
              )}
              <div className="flex w-full flex-row items-start justify-between gap-2">
                <div className="h-14 flex items-center min-w-[104px] max-w-[104px]">{`${belongsFields.image.fieldTitle}${
                  belongsFields.image.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <AddMediaElement
                    block="tutorialMeta"
                    chapterIndex={undefined}
                    subchapterIndex={undefined}
                    listIndex={undefined}
                    mediaType="image"
                    className="without-bg"
                  />
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
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <div className="min-w-[104px] max-w-[104px]">{`${responsibleFields.faculty.fieldTitle}${
                  responsibleFields.faculty.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <select
                    value={responsibleFields.faculty.value}
                    className="w-full p-4 rounded text-[#96969B] border text-base bg-seasalt border-dim"
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
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <div className="min-w-[104px] max-w-[104px]">{`${responsibleFields.teachers.fieldTitle}${
                  responsibleFields.teachers.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <>
                    <div className="w-full">
                      <div className="relative mx-auto flex w-full flex-col gap-y-4 pt-4 z-10">
                        <input
                          type="text"
                          placeholder="search teacher"
                          className="w-full p-4 rounded border placeholder:text-stone text-base bg-seasalt border-dim [&+div]:focus:opacity-100 [&+div]:focus:visible"
                          value={responsibleFields.teachers.value}
                          onChange={(e) => handleTeacherInputChange(e.target.value)}
                          onFocus={() => setShowDropdownTeacher(true)}
                          onBlur={() =>
                            setTimeout(() => {
                              setShowDropdownTeacher(false)
                            }, 100)
                          }
                        />
                        {showDropdownTeacher &&
                          displayedTeachers.length > 0 &&
                          responsibleFields.teachers.value.length > 0 && (
                            <div
                              className={
                                'absolute top-full w-full rounded left-0 flex max-h-28 w-full flex-col gap-y-2 overflow-y-auto border bg-seasalt border-dim  [&>button]:py-2'
                              }
                            >
                              {displayedTeachers &&
                                displayedTeachers.map((item, index) => (
                                  <button
                                    className="w-full text-left hover:bg-tertiary-grey-silver px-4"
                                    key={index}
                                    onClick={() => handleTeacherSelect(item)}
                                  >
                                    {item}
                                  </button>
                                ))}
                            </div>
                          )}
                      </div>
                    </div>
                  </>
                </div>
              </div>
              <div className="flex w-full flex-row justify-end">
                <div className="flex sm:w-9/12 w-[calc(100%-112px)] flex-row flex-wrap gap-x-2 gap-y-2 ">
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

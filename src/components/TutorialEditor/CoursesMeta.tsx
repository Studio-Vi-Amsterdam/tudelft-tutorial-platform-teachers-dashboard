import React, { useEffect, useState } from 'react'
import EditorLabel from '../ui/EditorLabel'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import {
  addKeywordsToList,
  addKeywordsToProposed,
  addTeacherToList,
  addTeacherToProposed,
  changeCourseIdListField,
  changeMetaField,
  deleteKeyword,
  deleteTeacher,
  removeKeywordFromProposed,
  removeTeacherFromProposed,
} from 'src/redux/features/editorSlice'
import { ObjectNameType, TutorialMetaObject, TutorialResponsibleInterface } from 'src/types/types'
import { Button } from '../ui/Button'
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog'
import TextInput from '../ui/TextInput'
import { taxonomiesAPI } from 'src/lib/api'
import AddMediaElement from './AddMediaElement'

const CoursesMeta = () => {
  const errValidationStyle = 'border border-red-500 rounded-sm'

  const belongsFields = useAppSelector((state: RootState) => state.editor.meta.courseBelongs)
  const responsibleFields = useAppSelector(
    (state: RootState) => state.editor.meta.courseResponsible,
  )
  const dispatch = useAppDispatch()

  const handleMetaInputChange = (
    value: string,
    objectName: ObjectNameType,
    responsibleKeyName: keyof TutorialResponsibleInterface,
  ) => {
    if (responsibleKeyName) {
      dispatch(
        changeMetaField({
          value,
          objectName,
          responsibleKeyName,
        }),
      )
    }
  }

  const handleChangeInput = (
    value: string,
    objectName: keyof TutorialMetaObject,
    courseBelongsKeyName: 'course' | 'courseCode',
  ) => {
    dispatch(
      changeMetaField({
        value,
        objectName,
        courseBelongsKeyName,
      }),
    )
  }

  const handleMetaIdInputChange = (
    value: string,
    objectName: ObjectNameType,
    belongsKeyName: 'primaryStudy' | 'secondaryStudy',
  ) => {
    if (belongsKeyName) {
      dispatch(changeCourseIdListField({ value, belongsKeyName }))
    }
  }
  const keywordsArr: string[] | [] = useAppSelector((state: RootState) =>
    state.editor.meta.courseBelongs ? state.editor.meta.courseBelongs.keywords.proposedList : [],
  )
  const teachersArr: string[] | [] = useAppSelector((state: RootState) =>
    state.editor.meta.courseResponsible
      ? state.editor.meta.courseResponsible.teachers.proposedList
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

  const [addKeywordDialogOpened, setAddKeywordDialogOpened] = useState<boolean>(false)
  const [showDropdown, setShowDropdown] = useState<boolean>(true)
  const [showDropdownTeacher, setShowDropdownTeacher] = useState<boolean>(true)

  const handleKeywordInputChange = (keyword: string) => {
    dispatch(
      changeMetaField({
        value: keyword,
        objectName: 'courseBelongs',
        courseBelongsKeyName: 'keywords',
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

  const handleMetaInputKeywordsChange = (
    value: string,
    objectName: ObjectNameType,
    belongsKeyName?: 'level' | 'image' | 'keywords',
  ) => {
    if (value[value.length - 1] === ';') {
      dispatch(addKeywordsToList({ value: value.split(';')[0], objectName: 'courseBelongs' }))
      dispatch(
        removeKeywordFromProposed({ value: value.split(';')[0], objectName: 'courseBelongs' }),
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
  const deleteKeywordFromList = (keyword: string) => {
    dispatch(deleteKeyword({ value: keyword, objectName: 'courseBelongs' }))
    dispatch(addKeywordsToProposed({ value: keyword, objectName: 'courseBelongs' }))
  }
  const handleKeywordSelect = (val: string) => {
    handleMetaInputKeywordsChange(val + ';', 'courseBelongs', 'keywords')
    dispatch(
      changeMetaField({
        value: '',
        objectName: 'courseBelongs',
        courseBelongsKeyName: 'keywords',
      }),
    )
  }

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
  const handleTeacherInputChange = (teacher: string) => {
    dispatch(
      changeMetaField({
        value: teacher,
        objectName: 'courseResponsible',
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
  const handleMetaInputTeachersChange = (value: string) => {
    dispatch(addTeacherToList({ value: value.split(';')[0], objectName: 'courseResponsible' }))
    dispatch(
      removeTeacherFromProposed({ value: value.split(';')[0], objectName: 'courseResponsible' }),
    )
    dispatch(
      changeMetaField({
        value: '',
        objectName: 'courseResponsible',
        belongsKeyName: undefined,
        responsibleKeyName: 'teachers',
      }),
    )
  }
  const handleTeacherSelect = (val: string) => {
    handleMetaInputTeachersChange(val + ';')
    dispatch(
      changeMetaField({
        value: '',
        objectName: 'courseResponsible',
        responsibleKeyName: 'teachers',
      }),
    )
  }

  const deleteTeacherFromList = (teacher: string) => {
    dispatch(deleteTeacher({ value: teacher, objectName: 'courseResponsible' }))
    dispatch(addTeacherToProposed({ value: teacher, objectName: 'courseResponsible' }))
  }

  return (
    <>
      <section className="relative flex w-full flex-col gap-y-6 py-14 sm:py-20 before:absolute before:left-0 before:top-0 before:h-[2px] before:w-full before:bg-tertiary-grey-silver">
        <EditorLabel>
          Filling in the subject mandatory to ensure the right navigation. If this tutorial also
          belongs to a course ans software, please also fill that in. This information won’t be
          displayed, but used to place the tutorial in the right place in the sitemap.
        </EditorLabel>
        <h3 className="font-bold ms:mb-0 mb-4">This course page belongs to</h3>
        <div className="flex flex-col gap-y-8">
          {belongsFields && (
            <>
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <div className="min-h-14 min-w-[104px] max-w-[104px]">{`${belongsFields.courseCode.fieldTitle}${
                  belongsFields.courseCode.required ? '*' : ''
                }`}</div>
                <div
                  className={`w-9/12 ${!belongsFields.courseCode.isValid && errValidationStyle}`}
                >
                  <input
                    value={belongsFields.courseCode.value}
                    placeholder={belongsFields.courseCode.fieldTitle}
                    onChange={(e) =>
                      handleChangeInput(e.target.value, 'courseBelongs', 'courseCode')
                    }
                    className="w-full rounded-[4px] border border-DIM bg-background-seasalt p-4  text-tertiary-grey-stone"
                  />
                </div>
              </div>
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <div className="min-h-14 min-w-[104px] max-w-[104px]">{`${belongsFields.primaryStudy.fieldTitle}${
                  belongsFields.primaryStudy.required ? '*' : ''
                }`}</div>
                <div
                  className={`w-9/12 ${!belongsFields.primaryStudy.isValid && errValidationStyle}`}
                >
                  <select
                    value={belongsFields.primaryStudy.value.title}
                    className="w-full rounded-[4px] border border-DIM bg-background-seasalt p-4  text-tertiary-grey-stone"
                    onChange={(e) =>
                      handleMetaIdInputChange(e.target.value, 'courseBelongs', 'primaryStudy')
                    }
                  >
                    <option value="">{belongsFields.primaryStudy.fieldTitle}</option>
                    {belongsFields.primaryStudy.list &&
                      belongsFields.primaryStudy.list.map((listItem, index) => (
                        <option key={index} value={listItem.title}>
                          {listItem.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <div className="min-h-14 min-w-[104px] max-w-[104px]">{`${belongsFields.secondaryStudy.fieldTitle}${
                  belongsFields.secondaryStudy.required ? '*' : ''
                }`}</div>
                <div
                  className={`w-9/12 ${!belongsFields.secondaryStudy.isValid && errValidationStyle}`}
                >
                  <select
                    value={belongsFields.secondaryStudy.value.title}
                    className="w-full rounded-[4px] border border-DIM bg-background-seasalt p-4  text-tertiary-grey-stone"
                    onChange={(e) =>
                      handleMetaIdInputChange(e.target.value, 'courseBelongs', 'secondaryStudy')
                    }
                  >
                    <option value="">{belongsFields.secondaryStudy.fieldTitle}</option>
                    {belongsFields.secondaryStudy.list &&
                      belongsFields.secondaryStudy.list.map((listItem, index) => (
                        <option key={index} value={listItem.title}>
                          {listItem.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              {/* <div className="flex w-full flex-row items-center justify-between"> */}
              {/*  <div className="min-h-14">{`${belongsFields.secondaryStudy.fieldTitle}${ */}
              {/*    belongsFields.secondaryStudy.required ? '*' : '' */}
              {/*  }`}</div> */}
              {/*  <div className="w-9/12"> */}
              {/*    <select */}
              {/*      value={belongsFields.secondaryStudy.value.title} */}
              {/*      className="w-full p-4 rounded border text-[#96969B] text-base bg-seasalt border-dim" */}
              {/*      onChange={(e) => */}
              {/*        handleMetaIdInputChange(e.target.value, 'courseBelongs', 'secondaryStudy') */}
              {/*      } */}
              {/*    > */}
              {/*      <option value="">{belongsFields.secondaryStudy.fieldTitle}</option> */}
              {/*      {belongsFields.secondaryStudy.list && */}
              {/*        belongsFields.secondaryStudy.list.map((listItem, index) => ( */}
              {/*          <option key={index} value={listItem.title}> */}
              {/*            {listItem.title} */}
              {/*          </option> */}
              {/*        ))} */}
              {/*    </select> */}
              {/*  </div> */}
              {/* </div> */}
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
                        value={belongsFields.keywords.value}
                        onChange={(e) => handleKeywordInputChange(e.target.value)}
                        className={`w-full p-4 rounded border placeholder:text-stone text-base bg-seasalt border-dim [&+div]:focus:opacity-100 [&+div]:focus:visible ${!belongsFields.keywords.isValid && errValidationStyle}`}
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
                            {displayedKeywords.map((item, index) => (
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
                    <div className=" h-[58px]">
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
                  <div className="flex w-[calc(100%-112px)] sm:w-9/12 sm:flex-row flex-col max-sm:items-start flex-wrap gap-x-2 gap-y-2">
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
                <div className={`w-9/12 ${!belongsFields.image.isValid && errValidationStyle}`}>
                  <AddMediaElement
                    block="courseMeta"
                    chapterIndex={undefined}
                    subchapterIndex={undefined}
                    listIndex={undefined}
                    mediaType="image"
                    className="without-bg"
                  />
                </div>
              </div>
              <Dialog open={addKeywordDialogOpened} onOpenChange={setAddKeywordDialogOpened}>
                <DialogContent className="bg-white p-10">
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
                <div
                  className={`w-9/12 ${!responsibleFields.faculty.isValid && errValidationStyle}`}
                >
                  <select
                    value={responsibleFields.faculty.value}
                    className="w-full rounded-[4px] border border-DIM bg-background-seasalt p-4  text-tertiary-grey-stone"
                    onChange={(e) =>
                      handleMetaInputChange(e.target.value, 'courseResponsible', 'faculty')
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
                      <div className="relative mx-auto flex w-full flex-col gap-y-4 z-10">
                        <input
                          type="text"
                          placeholder="search teacher"
                          className={`w-full rounded-[4px] border border-DIM bg-background-seasalt p-4  text-tertiary-grey-stone ${!responsibleFields.teachers.isValid && errValidationStyle}`}
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
                <div className="flex sm:w-9/12 w-[calc(100%-112px)] flex-row flex-wrap gap-x-2 gap-y-2">
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

export default CoursesMeta

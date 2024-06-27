import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog'
import EditorLabel from '../ui/EditorLabel'
import TextInput from '../ui/TextInput'
import { Button } from '../ui/Button'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import {
  addKeywordsToList,
  addKeywordsToProposed,
  changeMetaField,
  changeSoftwareIdListField,
  deleteKeyword,
  removeKeywordFromProposed,
} from 'src/redux/features/editorSlice'
import { ObjectNameType } from 'src/types/types'
import { taxonomiesAPI } from 'src/lib/api'
import AddMediaElement from './AddMediaElement'

const SoftwaresMeta = () => {
  const belongsFields = useAppSelector((state: RootState) => state.editor.meta.softwareBelongs)
  const keywordsArr: string[] | [] = useAppSelector((state: RootState) =>
    state.editor.meta.softwareBelongs
      ? state.editor.meta.softwareBelongs.keywords.proposedList
      : [],
  )
  const dispatch = useAppDispatch()
  useEffect(() => {
    setDisplayedKeywords(keywordsArr)
  }, [keywordsArr])

  const handleMetaIdInputChange = (
    value: string,
    objectName: ObjectNameType,
    belongsKeyName: 'softwareVersion',
  ) => {
    if (belongsKeyName) {
      dispatch(changeSoftwareIdListField({ value, belongsKeyName }))
    }
  }

  const [displayedKeywords, setDisplayedKeywords] = useState<string[]>(keywordsArr)
  const [addKeywordDialogOpened, setAddKeywordDialogOpened] = useState<boolean>(false)

  const handleKeywordInputChange = (keyword: string) => {
    dispatch(
      changeMetaField({
        value: keyword,
        objectName: 'softwareBelongs',
        softwareBelongsKeyName: 'keywords',
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
    belongsKeyName?: 'keywords',
  ) => {
    if (value[value.length - 1] === ';') {
      dispatch(addKeywordsToList({ value: value.split(';')[0], objectName: 'softwareBelongs' }))
      dispatch(
        removeKeywordFromProposed({ value: value.split(';')[0], objectName: 'softwareBelongs' }),
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
    dispatch(deleteKeyword({ value: keyword, objectName: 'softwareBelongs' }))
    dispatch(addKeywordsToProposed({ value: keyword, objectName: 'softwareBelongs' }))
  }
  const handleKeywordSelect = (val: string) => {
    handleMetaInputKeywordsChange(val + ';', 'softwareBelongs', 'keywords')
    dispatch(
      changeMetaField({
        value: '',
        objectName: 'softwareBelongs',
        softwareBelongsKeyName: 'keywords',
      }),
    )
  }

  const inputValue = useAppSelector(
    (state: RootState) => state.editor.meta.softwareBelongs?.keywords.value,
  )
  useEffect(() => {
    console.log('inputValue', inputValue)
  }, [inputValue])

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
        <h3 className="font-bold">This course page belongs to</h3>
        <div className="flex flex-col gap-y-8">
          {belongsFields && (
            <>
              <div className="flex w-full flex-row items-center justify-between">
                <div>{`${belongsFields.softwareVersion.fieldTitle}${
                  belongsFields.softwareVersion.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <select
                    value={belongsFields.softwareVersion.value.title}
                    className="w-full p-4 rounded text-[#96969B] border text-base bg-seasalt border-dim"
                    onChange={(e) =>
                      handleMetaIdInputChange(e.target.value, 'softwareBelongs', 'softwareVersion')
                    }
                  >
                    <option value="">{belongsFields.softwareVersion.fieldTitle}</option>
                    {belongsFields.softwareVersion.list &&
                      belongsFields.softwareVersion.list.map((listItem, index) => (
                        <option key={index} value={listItem.title}>
                          {listItem.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="flex w-full flex-row items-start justify-between">
                <div className="h-14 flex items-center">{`${belongsFields.keywords.fieldTitle}${
                  belongsFields.keywords.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <>
                    <div className="w-full">
                      <div className="relative mx-auto flex w-full flex-col gap-y-4 pt-4">
                        <div className="grow relative z-10">
                          <input
                            type="text"
                            placeholder="search keyword"
                            className="w-full p-4 rounded border placeholder:text-[#96969B] text-base bg-seasalt border-dim"
                            value={belongsFields.keywords.value}
                            onChange={(e) => handleKeywordInputChange(e.target.value)}
                          />
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
                        </div>
                        <div className="h-full h-14">
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
                  </>
                </div>
              </div>
              <div className="flex w-full flex-row justify-end">
                <div className="flex w-9/12 flex-row flex-wrap gap-x-2 gap-y-2 pt-4">
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
              <div className="flex w-full flex-row items-start justify-between">
                <div className="h-14 flex items-center">{`${belongsFields.image.fieldTitle}${
                  belongsFields.image.required ? '*' : ''
                }`}</div>
                <div className="w-9/12">
                  <AddMediaElement
                    block="softwareMeta"
                    chapterIndex={undefined}
                    subchapterIndex={undefined}
                    listIndex={undefined}
                    mediaType="image"
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
      </section>
    </>
  )
}

export default SoftwaresMeta

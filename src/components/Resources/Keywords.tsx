import React, { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/Dialog'
import EditorLabel from '@/components/ui/EditorLabel'
import TextInput from '@/components/ui/TextInput'
import { Button } from '@/components/ui/Button'
import { taxonomiesAPI } from '@/lib/api'

interface KeywordsProps {
  keywords: any[]
  selectedKeywords: any[]
  onAddKeyword: () => void
  onUpdateSelectedKeywords: (next: { id: number; title: string }[]) => void
}

export const Keywords = (props: KeywordsProps) => {
  const [addKeywordDialogOpened, setAddKeywordDialogOpened] = useState<boolean>(false)
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [newKeyword, setNewKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const displayedKeywords = props.keywords.filter((keyword) => {
    const isSelected = props.selectedKeywords.some(
      (selected) => selected.id === keyword.id
    )
    if (isSelected) return false

    const q = search.trim().toLowerCase()
    if (!q) return true

    return keyword.title.toLowerCase().includes(q)
  })


  const deleteKeywordFromList = (keywordId: number) => {
    const next = props.selectedKeywords.filter((k) => k.id !== keywordId)
    props.onUpdateSelectedKeywords(next)
  }


  const handleKeywordSelect = (keywordId: number) => {
    const found = props.keywords.find((k) => k.id === keywordId)
    if (!found) return

    const alreadySelected = props.selectedKeywords.some((k) => k.id === keywordId)
    if (alreadySelected) return

    const next = [...props.selectedKeywords, found]
    props.onUpdateSelectedKeywords(next)
    setShowDropdown(false)
  }

  const handleCreateNewKeyword = async (keyword: string) => {
    setIsLoading(true)
    setError('')
    try {
      const response = await taxonomiesAPI.createKeyword(keyword).then((res) => res)
      if (response.status === 200) {
        props.onAddKeyword()
        setAddKeywordDialogOpened(false)
      }
    } catch (e: any) {
      console.log(e)
      setError(e?.response?.data?.message ?? 'Something went wrong')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      <div className="flex w-full flex-row items-start justify-between gap-2">
        <div className="h-14 flex items-center min-w-[104px] max-w-[104px]">Keywords*</div>
        <div className="w-9/12">
          <div className="relative mx-auto flex w-full  sm:gap-x-4 gap-1">
            <div className="grow relative z-10">
              <input
                type="text"
                placeholder="Search keyword"
                className={`w-full p-4 rounded-sm placeholder:text-[#96969B] border text-base bg-seasalt border-dim`}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowDropdown(true)}
              />
              {showDropdown && displayedKeywords.length > 0 && (
                <div
                  ref={containerRef}
                  className={
                    ' absolute top-full rounded-sm left-0 flex max-h-28 w-full flex-col gap-y-2 overflow-y-auto border bg-seasalt border-dim  [&>button]:py-2'
                  }
                >
                  {displayedKeywords?.map((item, index) => (
                      <button
                        className="w-full text-left hover:bg-tertiary-grey-silver px-4"
                        key={item.id}
                        onClick={() => handleKeywordSelect(item.id)}
                      >
                        {item.title}
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

      {props.selectedKeywords.length > 0 && (
        <div className="flex mt-2 w-full flex-row justify-end">
          <div
            className="flex sm:w-9/12 w-[calc(100%-112px)] sm:flex-row flex-col max-sm:items-start flex-wrap gap-x-2 gap-y-2">
            {props.selectedKeywords.map((keyword, index) => (
              <button
                key={index}
                className="relative rounded-[4px] bg-tertiary-skyBlue-10 py-1 pl-2 pr-8 before:absolute before:right-2 before:top-1/2 before:h-4 before:w-4 before:-translate-y-1/2 pseudo-bg-cross before:bg-center before:bg-no-repeat"
                onClick={() => deleteKeywordFromList(keyword.id)}
              >
                {keyword.title}
              </button>
            ))}
          </div>
        </div>
      )}


      <Dialog open={addKeywordDialogOpened} onOpenChange={setAddKeywordDialogOpened}>
        <DialogContent className="bg-white">
          <EditorLabel>Create new keyword</EditorLabel>
          <TextInput
            placeholder="Keyword"
            value={newKeyword}
            handleChange={(val: string) => setNewKeyword(val)}
          />
          {error && (
            <p className="text-red-500">{error}</p>
          )}
          <DialogFooter>
            <Button
              disabled={
                isLoading ||
                !newKeyword ||
                [
                  ...props.keywords,
                  ...props.selectedKeywords,
                ].includes(newKeyword)
              }
              onClick={() => handleCreateNewKeyword(newKeyword)}
            >
              <p>{isLoading ? '...' : 'Create'}</p>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
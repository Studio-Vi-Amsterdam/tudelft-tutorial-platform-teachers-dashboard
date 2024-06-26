import React, { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog'
import EditorLabel from '../ui/EditorLabel'
import TextInput from '../ui/TextInput'
import { Button } from '../ui/Button'
import { TermDialogInterface } from 'src/types/types'
import { taxonomiesAPI } from 'src/lib/api'

interface TermDialogProps {
  setTermDialog: React.Dispatch<React.SetStateAction<TermDialogInterface>>
  termDialog: TermDialogInterface
  setTermDialogOpened: (val: boolean) => void
  handleSubmitTerm: () => void
}

const TermDialog = (props: TermDialogProps) => {
  const { setTermDialog, termDialog, setTermDialogOpened, handleSubmitTerm } = props
  interface TermInterface {
    term: string
    explanation: string
  }
  interface ResponseObject {
    count: number
    description: string
    filter: string
    name: string
    parent: number
    slug: string
    taxonomy: string
    term_group: number
    term_id: number
    term_taxonomy_id: number
  }
  const [terms, setTerms] = useState<TermInterface[] | []>([])
  const [displayedTerms, setDisplayedTerms] = useState<TermInterface[] | []>([])

  const [inputValue, setInputValue] = useState<string>('')

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const teachers: ResponseObject[] = await taxonomiesAPI.getTeachers().then((res) => res.data)
      const keywords: ResponseObject[] = await taxonomiesAPI.getKeywords().then((res) => res.data)
      const concatedArr = [...keywords, ...teachers]
      const responseArr = concatedArr.map((item) => {
        return {
          id: item.term_id,
          term: item.name,
          explanation: item.description,
        }
      })
      setTerms(responseArr)
      setDisplayedTerms(responseArr)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputValue])

  const handleTermInputChange = (val: string) => {
    setInputValue(val)
    const newDisplayedValues = terms
      .filter((item) => item.term.startsWith(val))
      .sort((a, b) => a.term.localeCompare(b.term))
    setDisplayedTerms(newDisplayedValues)
  }

  const [selectOpened, setSelectOpened] = useState<boolean>(false)

  const handleSelect = (props: TermInterface) => {
    handleTermInputChange(props.term)
    setTermDialog({
      ...termDialog,
      term: props.term,
      explanation: props.explanation,
    })
  }
  return (
    <Dialog open={termDialog.isOpen} onOpenChange={setTermDialogOpened}>
      <DialogContent className="bg-white">
        <EditorLabel>Search term</EditorLabel>
        <TextInput
          placeholder="term"
          value={termDialog.term}
          handleChange={(val: string) =>
            setTermDialog({
              ...termDialog,
              term: val,
            })
          }
        />
        <div className="flex w-full flex-col rounded-[4px] border border-tertiary-grey-dim bg-background-seasalt">
          <button
            className={`${selectOpened ? 'pb-4' : 'pb-2'} px-2 pt-2 text-left`}
            onClick={() => (selectOpened ? setSelectOpened(false) : setSelectOpened(true))}
          >
            {inputValue.trim() === '' ? 'search term' : inputValue}
          </button>
          {selectOpened && (
            <div className="mx-auto flex w-[96%] flex-col gap-y-4 border-t border-tertiary-grey-dim pt-4">
              <input
                type="text"
                placeholder="search term"
                className="p-1"
                value={inputValue}
                onChange={(e) => handleTermInputChange(e.target.value)}
              />
              <div className="flex max-h-28 flex-col gap-y-2 overflow-y-auto px-2 pb-2 [&>button]:py-2">
                {displayedTerms.map((item, index) => (
                  <button
                    className="w-full text-left hover:bg-tertiary-grey-silver"
                    key={index}
                    onClick={() => handleSelect(item)}
                  >
                    {item.term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <EditorLabel>Type the explanation of the term here</EditorLabel>
        <TextInput
          placeholder="explanation"
          value={termDialog.explanation}
          handleChange={(val: string) =>
            setTermDialog({
              ...termDialog,
              explanation: val,
            })
          }
        />
        <DialogFooter>
          <Button
            onClick={handleSubmitTerm}
            disabled={
              termDialog.term.replace(/\s+/g, '').length === 0 ||
              termDialog.explanation.replace(/\s+/g, '').length === 0
            }
          >
            <p>Save</p>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TermDialog

import React, { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog'
import EditorLabel from '../ui/EditorLabel'
import TextInput from '../ui/TextInput'
import { Button } from '../ui/Button'
import { ArtictesType, TermDialogInterface } from 'src/types/types'
import { useSearchParams } from 'react-router-dom'
import { articlesAPI } from 'src/lib/api'

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
    id: number
    title: string
    description: string
  }

  const [terms, setTerms] = useState<TermInterface[] | []>([])
  const [displayedTerms, setDisplayedTerms] = useState<TermInterface[] | []>([])
  const [articleType, setArticleType] = useState<ArtictesType | undefined>(undefined)
  const [inputValue, setInputValue] = useState<string>('')

  const inputRef = useRef<HTMLInputElement | null>(null)

  const [searchParams] = useSearchParams()

  useEffect(() => {
    setArticleType((searchParams.get('type') as ArtictesType) ?? 'tutorials')
  }, [searchParams])

  useEffect(() => {
    const fetchData = async () => {
      if (articleType !== undefined) {
        const termsResponse: ResponseObject[] | [] = await articlesAPI
          .getInfo(articleType)
          .then((res) => {
            if (articleType === 'tutorials') {
              return res?.data?.data?.defined_terms ?? []
            }
            return res?.data?.defined_terms ?? []
          })
        const responseArr =
          termsResponse.length > 0
            ? termsResponse.map((term) => {
                return {
                  id: term.id,
                  term: term.title,
                  explanation: term.description,
                }
              })
            : []
        setTerms(responseArr)
        setDisplayedTerms(responseArr)
      }
    }
    fetchData()
  }, [articleType])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputValue])

  const handleTermInputChange = (val: string) => {
    setInputValue(val)
    const newDisplayedValues = terms
      .filter((item) =>
        item.term.toLowerCase().replace(/\s/g, '').includes(val.toLowerCase().replace(/\s/g, '')),
      )
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
            Search term
          </button>
          {selectOpened && (
            <div className="mx-auto flex w-[96%] flex-col gap-y-4 border-t border-tertiary-grey-dim pt-4">
              <input
                type="text"
                placeholder="Search term"
                className="p-1 border border-[#999999]"
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
          placeholder="Explanation"
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

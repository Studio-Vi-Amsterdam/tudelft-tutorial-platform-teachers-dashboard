import React, { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog'
import EditorLabel from '../ui/EditorLabel'
import TextInput from '../ui/TextInput'
import { Button } from '../ui/Button'
import { TermDialogInterface } from 'src/types/types'

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

  const hardcodeTermins = [
    {
      term: 'Aberration',
      explanation: 'A departure from what is normal or expected',
    },
    { term: 'Benevolent', explanation: 'Well meaning and kindly' },
    {
      term: 'Capitulate',
      explanation: 'Cease to resist an opponent or an unwelcome demand; yield',
    },
    { term: 'Debilitate', explanation: 'Make someone weak and infirm' },
    { term: 'Ebullient', explanation: 'Cheerful and full of energy' },
    {
      term: 'Facetious',
      explanation: 'Treating serious issues with deliberately inappropriate humor',
    },
    {
      term: 'Garrulous',
      explanation: 'Excessively talkative, especially on trivial matters',
    },
    {
      term: 'Hackneyed',
      explanation: 'Lacking significance through having been overused',
    },
    {
      term: 'Iconoclast',
      explanation: 'A person who attacks cherished beliefs or institutions',
    },
    {
      term: 'Juxtapose',
      explanation: 'Place or deal with close together for contrasting effect',
    },
    {
      term: 'Kudos',
      explanation: 'Praise and honor received for an achievement',
    },
    {
      term: 'Languid',
      explanation: 'Lacking in vigor or vitality; slack or slow',
    },
    {
      term: 'Mellifluous',
      explanation: 'Sweet or musical; pleasant to hear',
    },
    { term: 'Nefarious', explanation: 'Wicked or criminal' },
    {
      term: 'Obfuscate',
      explanation: 'Render obscure, unclear, or unintelligible',
    },
    {
      term: 'Panacea',
      explanation: 'A solution or remedy for all difficulties or diseases',
    },
    {
      term: 'Quixotic',
      explanation: 'Exceedingly idealistic; unrealistic and impractical',
    },
    {
      term: 'Recalcitrant',
      explanation: 'Having an obstinately uncooperative attitude toward authority',
    },
    {
      term: 'Sanguine',
      explanation: 'Optimistic or positive, especially in a bad or difficult situation',
    },
    {
      term: 'Trepidation',
      explanation: 'A feeling of fear or agitation about something that may happen',
    },
    {
      term: 'Ubiquitous',
      explanation: 'Present, appearing, or found everywhere',
    },
    {
      term: 'Venerable',
      explanation:
        'Accorded a great deal of respect, especially because of age, wisdom, or character',
    },
    {
      term: 'Wistful',
      explanation: 'Having or showing a feeling of vague or regretful longing',
    },
    {
      term: 'Xenophobic',
      explanation:
        'Having or showing a dislike of or prejudice against people from other countries',
    },
    { term: 'Yield', explanation: 'To produce or provide' },
    { term: 'Zealous', explanation: 'Having or showing zeal' },
    { term: 'Acrimony', explanation: 'Bitterness or ill feeling' },
    {
      term: 'Bellicose',
      explanation: 'Demonstrating aggression and willingness to fight',
    },
    {
      term: 'Cacophony',
      explanation: 'A harsh, discordant mixture of sounds',
    },
    { term: 'Deleterious', explanation: 'Causing harm or damage' },
    { term: 'Egregious', explanation: 'Outstandingly bad; shocking' },
    {
      term: 'Furtive',
      explanation: 'Attempting to avoid notice or attention, typically because of guilt',
    },
    {
      term: 'Glib',
      explanation: 'Fluent and voluble but insincere and shallow',
    },
    { term: 'Heinous', explanation: 'Utterly odious or wicked' },
    {
      term: 'Impetuous',
      explanation: 'Acting or done quickly and without thought or care',
    },
    { term: 'Jocular', explanation: 'Fond of or characterized by joking' },
    {
      term: 'Keen',
      explanation: 'Having or showing eagerness or enthusiasm',
    },
    {
      term: 'Lethargic',
      explanation: 'Affected by lethargy; sluggish and apathetic',
    },
    { term: 'Morose', explanation: 'Sullen and ill-tempered' },
    {
      term: 'Nonchalant',
      explanation: 'Feeling or appearing casually calm and relaxed',
    },
    {
      term: 'Ostentatious',
      explanation: 'Characterized by vulgar or pretentious display',
    },
    {
      term: 'Pretentious',
      explanation:
        'Attempting to impress by affecting greater importance or merit than is actually possessed',
    },
    {
      term: 'Quagmire',
      explanation: 'A soft boggy area of land that gives way underfoot',
    },
    {
      term: 'Reprehensible',
      explanation: 'Deserving censure or condemnation',
    },
    {
      term: 'Sycophant',
      explanation: 'A person who acts obsequiously toward someone important to gain advantage',
    },
    {
      term: 'Taciturn',
      explanation: 'Reserved or uncommunicative in speech',
    },
    { term: 'Umbrage', explanation: 'Offense or annoyance' },
    {
      term: 'Vicarious',
      explanation:
        'Experienced in the imagination through the feelings or actions of another person',
    },
    {
      term: 'Wary',
      explanation: 'Feeling or showing caution about possible dangers or problems',
    },
  ]

  const [displayedTerms, setDisplayedTerms] = useState<TermInterface[]>(hardcodeTermins)

  const [inputValue, setInputValue] = useState<string>('')

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputValue])

  const handleTermInputChange = (val: string) => {
    setInputValue(val)
    const newDisplayedValues = hardcodeTermins
      .filter((item) => item.term.startsWith(val))
      .sort((a, b) => a.term.localeCompare(b.term))
    setDisplayedTerms(newDisplayedValues)
  }

  const [selectOpened, setSelectOpened] = useState<boolean>(false)
  // const [selectedOption, setSelectedOption] = useState<TermInterface>({
  //   term: termDialog.term,
  //   explanation: termDialog.explanation,
  // })
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

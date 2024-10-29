import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog'
import { ArrowLeft, ArrowRight, AvatarIcon, SmallFileIcon } from '../ui/Icons'
import { useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/Dropdown'
import { WhoHaveAccessInterface } from 'src/types/types'
import AutoCompleteInput from './AutoCompleteInput'
import { Button } from '../ui/Button'

interface AddAuthorModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddAuthorModal = (props: AddAuthorModalProps) => {
  const tutorialTitle = useAppSelector((state: RootState) => state.editor.tutorialTop.title)
  const tutorialTitleText = tutorialTitle.text.length > 0 ? tutorialTitle.text : 'Untitled article'
  const [step, setStep] = useState<number>(1)
  const [inputValue, setInputValue] = useState<string>('')
  const [listOfEditors, setListOfEditors] = useState<WhoHaveAccessInterface[]>([
    {
      email: 'You',
      role: 'editor',
    },
    {
      email: 'testtest@test.test',
      role: 'viewer',
      image: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
    },
  ])

  const [emails, setEmails] = useState<WhoHaveAccessInterface[]>([
    {
      email: 'testtest@test.test',
      role: 'viewer',
      image: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
    },
    {
      email: 'test1@test.test',
      role: 'viewer',
      image: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
    },
    {
      email: 'test3@test.test',
      role: 'viewer',
      image: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
    },
    {
      email: 'testFFF@test.test',
      role: 'viewer',
      image: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
    },
    {
      email: 'testEEE@test.test',
      role: 'viewer',
      image: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
    },
    {
      email: 'testFefefe@test.test',
      role: 'viewer',
      image: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
    },
  ])

  const toggleRole = (index: number) => {
    const newArr: WhoHaveAccessInterface[] = listOfEditors.map((item, i) => {
      if (i === index) {
        return { ...item, role: item.role === 'editor' ? 'viewer' : 'editor' }
      }
      return item
    })
    setListOfEditors(newArr)
  }

  const removeEditor = (email: string) => {
    const removedObject = listOfEditors.find((item) => item.email === email)
    if (removedObject) {
      setEmails((prevState) => [...prevState, removedObject])
    } else {
      setEmails((prevState) => [...prevState, { email, role: 'editor' }])
    }
    const newArr = listOfEditors.filter((item) => item.email !== email)
    setListOfEditors(newArr)
  }

  const handleAddEditor = () => {
    const addedObject = emails.find((item) => item.email === inputValue)
    if (addedObject) {
      setEmails((prevState) => prevState.filter((item) => item.email !== inputValue))
      setListOfEditors((prevState) => [...prevState, addedObject])
    } else {
      setListOfEditors((prevState) => [...prevState, { email: inputValue, role: 'editor' }])
    }
    setInputValue('')
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent className="bg-white xl:min-w-[888px] lg:min-w-[666px] max-sm:min-w-[90%] p-10 flex flex-col gap-y-10">
        <DialogHeader>
          <DialogTitle className="text-black font-normal font-sans text-h3 pr-8 text-left -tracking-1">
            {step === 1 && 'Select an editor'}
            {step === 2 && (
              <button
                className="flex flex-row gap-x-4 items-center text-left"
                onClick={() => setStep(1)}
              >
                <span className="flex justify-center items-center w-6 h-6">
                  <ArrowLeft />
                </span>
                {tutorialTitleText}
              </button>
            )}
          </DialogTitle>
        </DialogHeader>
        {step === 1 && (
          <>
            <div className="flex flex-row max-sm:flex-col gap-4 justify-between items-center w-full">
              <AutoCompleteInput
                possibleValues={emails}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <Button
                disabled={inputValue.trim().length < 2}
                className="px-10 max-sm:w-full py-3 disabled:bg-tertiary-grey-stone"
                onClick={() => handleAddEditor()}
              >
                Invite
              </Button>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="font-inter font-normal text-xl leading-[1.875rem] text-tertiary-grey-dim">
                Who has access
              </p>
              <div className="flex flex-row max-sm:flex-col max-sm:items-start justify-between items-center gap-x-10">
                <div className="flex flex-row items-center gap-x-2 text-black">
                  <div className="w-6 h-6 flex justify-center items-center">
                    <SmallFileIcon />
                  </div>
                  <p className="font-normal font-inter text-xl leading-[1.875rem] ">
                    {tutorialTitleText}
                  </p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="flex flex-row items-center gap-x-2 text-tertiary-grey-dim"
                >
                  <p className="font-inter font-normal text-xl leading-[1.875rem] text-tertiary-grey-dim">
                    {listOfEditors.length} person{' '}
                  </p>
                  <span className="w-3 h-3 flex justify-center items-center">
                    <ArrowRight />
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="flex flex-col gap-y-2">
              <p className="font-inter font-normal text-xl leading-[1.875rem] text-tertiary-grey-dim">
                Who has acces
              </p>
              {listOfEditors.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row max-sm:flex-col max-sm:items-start items-center justify-between"
                >
                  <div className="flex flex-row items-center gap-x-2">
                    <div className="w-6 h-6 text-[#292929]">
                      {item?.image ? (
                        <img
                          src={item.image}
                          alt={item.email}
                          className="object-cover rounded-full w-full h-full object-center"
                        />
                      ) : (
                        <AvatarIcon />
                      )}
                    </div>
                    <p className="text-black text-xl leading-[1.875rem] font-inter font-normal">
                      {item.email}
                    </p>
                  </div>
                  {index !== 0 ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="group capitalize flex flex-row items-center gap-x-2 text-tertiary-grey-dim text-xl leading-[1.875rem]">
                        {item.role}
                        <span className="w-3 h-3 flex justify-center items-center transition-transform duration-200 group-data-[state='open']:rotate-90">
                          <ArrowRight />
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="p-4 mt-2 pt-2 flex flex-col gap-y-4 bg-background-aliceBlue rounded border-none"
                      >
                        <DropdownMenuLabel className="font-normal text-sm text-primary-skyBlue">
                          Change to
                        </DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => toggleRole(index)}>
                          {item.role === 'editor' ? 'Viewer' : 'Editor'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => removeEditor(item.email)}>
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <p className="text-tertiary-grey-dim text-xl leading-[1.875rem] pr-[19px] font-normal">
                      Editor
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AddAuthorModal

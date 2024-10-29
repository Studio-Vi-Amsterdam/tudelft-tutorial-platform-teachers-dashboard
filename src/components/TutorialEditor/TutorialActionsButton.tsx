import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/Dropdown'
import { AddFileIcon, AuthorIcon, MoreIcon, TrashCanIcon } from '../ui/Icons'
import AddAuthorModal from './AddAuthorModal'

const TutorialActionsButton = () => {
  const [isAddAuthorDialogOpen, setIsAddAuthorDialogOpen] = useState<boolean>(false)

  const toggleAddAuthorDialogOpen = () => {
    setTimeout(() => {
      setIsAddAuthorDialogOpen(!isAddAuthorDialogOpen)
    }, 300)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="data-[state='open']:bg-tertiary-skyBlue-20 border-primary-skyBlue rounded flex py-2 px-4 border  flex-row gap-x-2 text-primary-skyBlue">
          Actions
          <MoreIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="p-4 mt-2 pt-2 flex flex-col gap-y-4 bg-background-aliceBlue rounded border-none"
        >
          <DropdownMenuLabel className="font-normal text-sm text-primary-skyBlue">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <span className="flex justify-center items-center w-6 h-6">
              <TrashCanIcon />
            </span>
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="flex justify-center items-center w-6 h-6">
              <AddFileIcon />
            </span>
            Migrate to
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toggleAddAuthorDialogOpen()}>
            <span className="flex justify-center items-center w-6 h-6">
              <AuthorIcon />
            </span>
            Add editor
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddAuthorModal isOpen={isAddAuthorDialogOpen} setIsOpen={toggleAddAuthorDialogOpen} />
    </>
  )
}

export default TutorialActionsButton

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
import { useNavigate } from 'react-router-dom'
import { useToast } from 'src/lib/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/AlertDialog'
import { articlesAPI } from 'src/lib/api'
import { ArtictesType, UsersItemInterface } from 'src/types/types'

interface TutorialActionsButtonProps {
  articleId: string | null
  articleType: ArtictesType
  usersList: UsersItemInterface[]
}

const TutorialActionsButton = (props: TutorialActionsButtonProps) => {
  const [isAddAuthorDialogOpen, setIsAddAuthorDialogOpen] = useState<boolean>(false)
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const toggleAddAuthorDialogOpen = () => {
    setTimeout(() => {
      setIsAddAuthorDialogOpen(!isAddAuthorDialogOpen)
    }, 300)
  }

  const handleDeleteArticle = () => {
    if (props.articleId && props.articleId !== 'new') {
      setIsFetching(true)
      articlesAPI.deleteArticle(props.articleType, parseInt(props.articleId)).finally(() => {
        navigate('/dashboard')
        toast({
          title: 'Success!',
          description: `Article with ID:${props.articleId} deleted successfully!`,
        })
        setIsFetching(false)
      })
    } else {
      navigate('/dashboard')
      toast({
        title: 'Success!',
        description: 'Article deleted successfully!',
      })
    }
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
          <DropdownMenuItem
            onClick={() =>
              setTimeout(() => {
                setIsDeletePopupOpen(true)
              }, 300)
            }
          >
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
          <DropdownMenuItem
            disabled={props.articleId === null || props.articleId === 'new'}
            onSelect={() => toggleAddAuthorDialogOpen()}
          >
            <span className="flex justify-center items-center w-6 h-6">
              <AuthorIcon />
            </span>
            Add editor
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddAuthorModal
        usersList={props.usersList}
        isOpen={isAddAuthorDialogOpen}
        setIsOpen={toggleAddAuthorDialogOpen}
        articleId={props.articleId}
      />
      <AlertDialog open={isDeletePopupOpen} onOpenChange={setIsDeletePopupOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete tutorial from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteArticle} disabled={isFetching}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default TutorialActionsButton

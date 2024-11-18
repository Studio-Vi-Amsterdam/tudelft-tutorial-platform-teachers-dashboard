import React, { useEffect, useState } from 'react'
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
import { ArtictesType, EditorState, UsersItemInterface } from 'src/types/types'
import MigrateModal from './MigrateModal'
import { validateArticle } from 'src/lib/validation'
import { reducerParser } from 'src/lib/reducerParser'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import { sendArticle } from 'src/lib/sendArticle'

interface TutorialActionsButtonProps {
  editor: EditorState
  articleId: string | null
  articleType: ArtictesType
  usersList: UsersItemInterface[]
}

interface ArticlePreviewInterface {
  id: number
  title: string
}

const TutorialActionsButton = (props: TutorialActionsButtonProps) => {
  // Flags
  const [isAddAuthorDialogOpen, setIsAddAuthorDialogOpen] = useState<boolean>(false)
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false)
  const [isMigratePopupOpen, setIsMigratePopupOpen] = useState<boolean>(false)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  // Data
  const [articlesList, setArticlesList] = useState<ArticlePreviewInterface[]>([])

  // Store
  const dispatch = useAppDispatch()
  const tutorial = useAppSelector((state: RootState) => state.editor)

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

  const validationErrToast = () => {
    toast({
      title: 'Something went wrong!',
      variant: 'destructive',
      description: 'Check that all required fields are filled in noted by * and outlined in red',
    })
  }

  const postDraftErrorToast = (error: string) => {
    toast({
      title: 'Something went wrong!',
      variant: 'destructive',
      description: error,
    })
  }

  const openMigrateWindow = async () => {
    const validationSucceed = validateArticle(
      props.editor,
      props.articleType,
      dispatch,
      validationErrToast,
    )
    if (validationSucceed) {
      const parsedObject = await reducerParser.parseFromReducer(
        tutorial,
        'publish',
        props.articleId !== 'new' ? props.articleId ?? undefined : undefined,
        props.articleType,
      )
      sendArticle(
        props.articleType,
        props.articleId,
        parsedObject,
        navigate,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
        postDraftErrorToast,
        true,
      ).finally(() => setIsMigratePopupOpen(true))
    } else {
      toast({
        title: 'Failed!',
        description:
          'Before migration please make sure all the fields in the current tutorial are valid',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: ArticlePreviewInterface[] = await articlesAPI
          .getArticles(props.articleType)
          .then((res) =>
            res.data
              ? res.data.map(({ id, title }: { id: number; title: string }) => ({ id, title }))
              : [],
          )
        setArticlesList(response)
      } catch (error) {
        console.error(error)
        setArticlesList([])
      }
    }
    fetchData()
  }, [])

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
                openMigrateWindow()
              }, 300)
            }
          >
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
        </DropdownMenuContent>
      </DropdownMenu>
      <AddAuthorModal
        usersList={props.usersList}
        isOpen={isAddAuthorDialogOpen}
        setIsOpen={toggleAddAuthorDialogOpen}
        articleId={props.articleId}
      />
      <MigrateModal
        isOpen={isMigratePopupOpen}
        setIsOpen={setIsMigratePopupOpen}
        articleId={props.articleId}
        articleType={props.articleType}
        articlesList={articlesList}
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

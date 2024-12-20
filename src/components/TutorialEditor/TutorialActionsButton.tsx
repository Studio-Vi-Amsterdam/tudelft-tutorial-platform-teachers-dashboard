import React, { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/Dropdown'
import { AddFileIcon, ArrowRight, TrashCanIcon } from '../ui/Icons'
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
import OverwriteModal from './OverwriteModal'
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
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false)
  const [isOverwritePopupOpen, setIsOverwritePopupOpen] = useState<boolean>(false)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  // Data
  const [articlesList, setArticlesList] = useState<ArticlePreviewInterface[]>([])

  // Store
  const dispatch = useAppDispatch()
  const tutorial = useAppSelector((state: RootState) => state.editor)

  const navigate = useNavigate()
  const { toast } = useToast()

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

  const openOverwriteModal = async () => {
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
      ).finally(() => setIsOverwritePopupOpen(true))
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
        <DropdownMenuTrigger className="[&>span]:data-[state='open']:rotate-[-90deg] flex items-center rounded-l-none bg-primary-skyBlue rounded py-4 px-3 border-l-[1px] border-white text-white">
          <span className="rotate-90 transition-all">
            <ArrowRight className="w-[18px] h-[18px]" />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="p-4 mt-2 pt-2 flex flex-col gap-y-4 bg-background-aliceBlue rounded border-none"
        >
          <DropdownMenuLabel className="font-normal text-sm text-primary-skyBlue">
            Actions
          </DropdownMenuLabel>

          <DropdownMenuItem onClick={openOverwriteModal}>
            <span className="flex justify-center items-center w-6 h-6">
              <AddFileIcon />
            </span>
            Overwrite to
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              setTimeout(() => {
                setIsDeletePopupOpen(true)
              }, 300)
            }
          >
            <span className="flex justify-center items-center w-6 h-6">
              <TrashCanIcon className="w-[20px] h-[20px]" />
            </span>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <OverwriteModal
        isOpen={isOverwritePopupOpen}
        setIsOpen={setIsOverwritePopupOpen}
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

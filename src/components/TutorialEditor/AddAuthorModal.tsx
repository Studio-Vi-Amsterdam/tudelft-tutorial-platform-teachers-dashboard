import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog'
import { ArrowLeft, ArrowRight, SmallFileIcon } from '../ui/Icons'
import { useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import { UserRoleType, UsersItemInterface } from 'src/types/types'
import AutoCompleteInput from './AutoCompleteInput'
import { Button } from '../ui/Button'
import { userAPI } from 'src/lib/api'
import { useToast } from 'src/lib/use-toast'
import AuthorsAccessRow from './AuthorsAccessRow'
import { Capitalize, RemoveLastSymbol } from '../../lib/capitalize'

interface AddAuthorModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  articleType: string | null
  usersList: UsersItemInterface[]
  articleId: string | null
}

const AddAuthorModal = (props: AddAuthorModalProps) => {
  const tutorialTitle = useAppSelector((state: RootState) => state.editor.tutorialTop.title)
  const tutorialTitleText = tutorialTitle.text.length > 0 ? tutorialTitle.text : 'Untitled article'
  const hasArticleId = props.articleId !== null && props.articleId !== 'new'
  const { toast } = useToast()

  const [step, setStep] = useState<number>(1)
  const [inputValue, setInputValue] = useState<string>('')
  const [emails, setEmails] = useState<UsersItemInterface[]>(props.usersList)
  const [listOfEditors, setListOfEditors] = useState<UsersItemInterface[]>([])
  const [listOfViewers, setListOfViewers] = useState<UsersItemInterface[]>([])

  const removeEditor = async (id: number): Promise<boolean> => {
    if (hasArticleId) {
      const editorObjectToRemove = listOfEditors.find((item) => item.id === id)
      const viewerObjectToRemove = listOfViewers.find((item) => item.id === id)

      if (editorObjectToRemove || viewerObjectToRemove) {
        const success = await userAPI
          .removeUserFromPost(
            props.articleId as string,
            id,
            editorObjectToRemove ? 'editor' : 'viewer',
          )
          .then((res) => res.status === 200)

        if (success) {
          if (editorObjectToRemove) {
            const newArr = listOfEditors.filter((item) => item.id !== id)
            setEmails((prevState) => [editorObjectToRemove, ...prevState])
            setListOfEditors(newArr)
          }
          if (viewerObjectToRemove) {
            const newArr = listOfViewers.filter((item) => item.id !== id)
            setEmails((prevState) => [viewerObjectToRemove, ...prevState])
            setListOfViewers(newArr)
          }
          return true
        } else {
          toast({
            title: 'Error',
            description: 'Failed to delete editor!',
            variant: 'destructive',
          })
        }
      }
    }
    return false
  }

  const handleAddEditor = async (
    role: UserRoleType = 'editor',
    id: number | undefined = undefined,
  ) => {
    if (hasArticleId) {
      const addedObject =
        id === undefined
          ? emails.find((item) => item.first_name === inputValue || item.email === inputValue)
          : props.usersList.find((item) => item.id === id)
      if (addedObject) {
        const success = await userAPI
          .addUserToPost(props.articleId as string, addedObject.id, role)
          .then((res) => res.status === 200)
        if (success) {
          setEmails((prevState) => prevState.filter((item) => item.id !== addedObject.id))
          if (role === 'editor') {
            setListOfEditors((prevState) => [...prevState, addedObject])
          } else if (role === 'viewer') {
            setListOfViewers((prevState) => [...prevState, addedObject])
          }
          setInputValue('')
        } else {
          toast({
            title: 'Error',
            description: 'Failed to add editor!',
            variant: 'destructive',
          })
        }
      }
    }
  }

  const toggleRole = async (id: number) => {
    const editorObject = listOfEditors.find((item) => item.id === id)
    const viewerObject = listOfViewers.find((item) => item.id === id)
    const currentRole = editorObject ? 'editor' : viewerObject ? 'viewer' : null
    if (currentRole) {
      const removedSuccessfully = await removeEditor(id)
      if (removedSuccessfully) {
        const newRole = currentRole === 'editor' ? 'viewer' : 'editor'
        await handleAddEditor(newRole, id)
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (hasArticleId) {
        try {
          const response = await userAPI
            .getEditorsAndViewers(props.articleId as string)
            .then((res) => res.data)
          response.editors ? setListOfEditors(response.editors) : setListOfEditors([])
          response.viewers ? setListOfViewers(response.viewers) : setListOfViewers([])
          // deleting user that related to article from proposed list
          const idsToRemove = new Set([
            ...response.editors.map((item: UsersItemInterface) => item?.id),
            ...response.viewers.map((item: UsersItemInterface) => item?.id),
          ])
          const filteredArray = props.usersList.filter(
            (item: UsersItemInterface) => !idsToRemove.has(item.id),
          )
          setEmails(filteredArray)
        } catch (error) {
          setListOfEditors([])
          setListOfViewers([])
        }
      }
    }
    fetchData()
  }, [])

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
                {Capitalize(RemoveLastSymbol(props.articleType ?? ''))} - {tutorialTitleText}
              </button>
            )}
          </DialogTitle>
        </DialogHeader>
        {step === 1 && (
          <>
            <div className="flex flex-row max-sm:flex-col gap-4 justify-between items-center w-full">
              <AutoCompleteInput
                possibleValues={emails}
                placeholder="Add editor by name or email"
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
                    {Capitalize(RemoveLastSymbol(props.articleType ?? ''))} - {tutorialTitleText}
                  </p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="flex flex-row items-center gap-x-2 text-tertiary-grey-dim"
                >
                  <p className="font-inter font-normal text-xl leading-[1.875rem] text-tertiary-grey-dim">
                    {listOfEditors.length + listOfViewers.length} person{' '}
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
                Who has access
              </p>
              {listOfEditors.map((item, index) => (
                <AuthorsAccessRow
                  key={index}
                  item={item}
                  removeEditor={removeEditor}
                  role="editor"
                  toggleRole={toggleRole}
                />
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AddAuthorModal

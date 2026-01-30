import EditorSidebar from '@/components/TutorialEditor/EditorSidebar'
import TutorialButtonsSection from '@/components/TutorialEditor/TutorialButtonsSection'
import { ArtictesType, LinkField, UsersItemInterface } from '@/types/types'
import Preloader from '@/components/ui/Preloader'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { RootState } from '@/redux/store'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@/lib/use-toast'
import { setEditorLoaded } from '@/redux/features/editorSlice'
import { articlesAPI, userAPI } from '@/lib/api'
import { getInfo } from '@/lib/reducerParser'
import TextInput from '@/components/ui/TextInput'
import BundledEditor from '@/components/TutorialEditor/BundledEditor'
import AuthorsRepeater from '@/components/TutorialEditor/AuthorsRepeater'
import FileElement from '@/components/Resources/FileElement'
import {
  hydrateResourceAcf,
  selectResource,
  setContentField,
  setField,
} from '@/redux/features/resourceSlice'
import { MultiSelect } from '@/components/ui/MultiSelect'
import { Keywords } from '@/components/Resources/Keywords'

export const ResourceEditor = () => {
  const [usersList, setUsersList] = useState<UsersItemInterface[]>([])
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const isFetched = useAppSelector((state: RootState) => state.editor.isEditorLoaded)
  const params = new URLSearchParams(useLocation().search)
  const articleType = params.get('type')
  const articleId = params.get('id')
  const { toast } = useToast()

  const [keywords, setKeywords] = useState([])
  const [faculties, setFaculties] = useState<[]>([])
  const resource = useAppSelector(selectResource)

  const handleGetTaxonomiesInfo = async () => {
    const data = await getInfo(articleType as ArtictesType).catch(() => {
      return {
        data: {
          faculties: [],
          keywords: [],
        }
      }
    })
    setKeywords(data?.data?.keywords ?? [])
    setFaculties(data?.data?.faculties ?? [])
  }

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setEditorLoaded(false))
      try {
        const usersListRes: UsersItemInterface[] = await userAPI.getUsers().then((res) => res.data)
        setUsersList(usersListRes)
      } catch (error) {
        console.error(error)
      }

      if (articleType && articleId) {
        await handleGetTaxonomiesInfo()

        if (articleId !== 'new') {
          const response = await articlesAPI
            .getSingleArticle(articleType as ArtictesType, parseInt(articleId))
            .then((res) => res.data)
            .catch((error) => {
              if (error.response?.status === 404) {
                toast({
                  title: 'Article not found',
                  description: 'Redirected to Dashboard',
                  variant: 'destructive',
                })
                navigate('/dashboard')
              }
            })

          if (response) {
            dispatch(hydrateResourceAcf(response.data))
          }
        }
        dispatch(setEditorLoaded(true))
      }
    }

    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, articleType, articleId])

  if(!isAuthenticated) {
    return (<div className="text-center px-6 py-12">You need to login!</div>)
  }

  return (
    <main className="container mx-auto flex flex-auto flex-row justify-between">
      <EditorSidebar tutorialTitle={resource.title} />
      <div className="flex w-full flex-col items-start md:pl-12 lg:pl-28 bg-white">
        {isFetched ? (
          <>
            <TutorialButtonsSection usersList={usersList} articleType={articleType} />

            <TextInput
              placeholder="OER title"
              headingType="h1"
              value={resource.title}
              handleChange={(val) => dispatch(setField({key: 'title', value: val}))}
              notValid={!resource.title}
            />

            <div className="mt-6 w-full">
              <TextInput
                placeholder="OER Subtitle"
                headingType="h2"
                value={resource.resource__content.subtitle}
                handleChange={(val) => dispatch(setContentField({ key: 'subtitle', value: val }))}
                notValid={false}
              />
            </div>

            <div className="w-full pb-10">
              <div className="mt-4 flex w-full flex-row items-center justify-between gap-2">
                <div className="min-w-[130px] max-w-[130px]">File upload*</div>
                <div className="w-9/12">
                  <div className="w-full">
                      <FileElement
                        file={resource.resource__pdf ? { id: resource.resource__pdf.id as number, url: resource.resource__pdf.url, isValid: !!resource.resource__pdf.id } : null}
                        onSetFile={(val) => {
                          dispatch(setField({ key: 'resource__pdf', value: val }))
                        }}
                      />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex w-full flex-row items-center justify-between gap-2">
                <div className="min-w-[130px] max-w-[130px]">Publication date*</div>
                <div className="w-9/12">
                  <div className="w-full">
                    <input
                      type="date"
                      placeholder="Publication date"
                      onChange={(e) => dispatch(setContentField({ key: 'publication_date', value: e.target.value }))}
                      className={`w-full p-4 rounded-sm border placeholder:text-stone text-base bg-seasalt border-dim [&+div]:focus:opacity-100 [&+div]:focus:visible`}
                      value={resource.resource__content.publication_date}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full py-10 border-t">
              <h3 className="font-bold mb-6">Abstract</h3>

              <BundledEditor
                handleChange={(val: any) => dispatch(setContentField({ key: 'abstract', value: val }))}
                value={resource.resource__content.abstract}
                notValid={false}
              />
            </div>

            <div className="w-full py-10 border-t">
              <h3 className="font-bold mb-6">Recommended Citation</h3>

              <BundledEditor
                handleChange={(val: any) => dispatch(setContentField({ key: 'recommended_citation', value: val }))}
                value={resource.resource__content.recommended_citation}
                notValid={false}
              />
            </div>

            <div className="w-full py-10 border-t">
              <h3 className="font-bold mb-6">Reference(s)</h3>

              <BundledEditor
                handleChange={(val: any) => dispatch(setContentField({ key: 'references', value: val }))}
                value={resource.resource__content.references}
                notValid={false}
              />
            </div>

            <div className="w-full py-10 border-t">
              <h3 className="font-bold mb-6">Author(s)</h3>
              <AuthorsRepeater
                value={resource.resource__authors}
                onChange={(val) => dispatch(setField({ key: 'resource__authors', value: val }))}
                buttonTitle="Author"
              />
            </div>

            <div className="w-full py-10 border-t">
              <h3 className="font-bold mb-6">Editor(s)</h3>
              <AuthorsRepeater
                value={resource.resource__editors}
                labelAuthor="Editor"
                onChange={(val) => dispatch(setField({ key: 'resource__editors', value: val }))}
                buttonTitle="Editor"
              />
            </div>

            <div className="w-full py-10 border-t">
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <div className="min-w-[104px] max-w-[104px]">Affiliation</div>
                <div
                  className={`w-9/12`}
                >
                  <MultiSelect
                    options={faculties.map((el: any) => ({
                      value: el.id,
                      label: el.title,
                    }))}
                    placeholder="Affiliation"
                    defaultValue={resource.faculty}
                    onValueChange={(values) => {
                      dispatch(setField({ key: 'faculty', value: values }))
                    }}
                    searchable={false}
                  />
                </div>
              </div>

              <div className="mt-4 flex w-full flex-row items-center justify-between gap-2">
                <div className="min-w-[104px] max-w-[104px]">Publisher</div>
                <div className="w-9/12">
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="Publisher"
                      className={`w-full p-4 rounded-sm border placeholder:text-stone text-base bg-seasalt border-dim [&+div]:focus:opacity-100 [&+div]:focus:visible`}
                      value={resource.resource__publisher}
                      onChange={(e) => dispatch(setField({key: 'resource__publisher', value: e.target.value}))}
                    />
                  </div>
                </div>
              </div>
            </div>


            <div className="w-full py-10 border-t">
              <h3 className="font-bold mb-6">Information</h3>

              <Keywords
                keywords={keywords}
                onAddKeyword={handleGetTaxonomiesInfo}
                selectedKeywords={resource.keywords}
                onUpdateSelectedKeywords={(keywords) => dispatch(setField({key: 'keywords', value: keywords}))}
              />

              <div className="mt-4 flex w-full flex-row items-center justify-between gap-2">
                <div className="min-w-[104px] max-w-[104px]">License</div>
                <div
                  className={`w-9/12`}
                >
                  <select
                    defaultValue={resource.resource__license}
                    className="w-full p-4 rounded-sm text-[#96969B] border text-base bg-seasalt border-dim"
                    onChange={(e) => dispatch(setField({ key: 'resource__license', value: e.target.value }))}
                  >
                    <option value="">License</option>
                    <option value="CC BY 4.0">CC BY 4.0</option>
                    <option value="CC BY 4.0">CC BY 4.0</option>
                    <option value="CC BY-NC 4.0">CC BY-NC 4.0</option>
                    <option value="CC0">CC0</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex w-full flex-row items-center justify-between gap-2">
                <div className="min-w-[104px] max-w-[104px]">DOI*</div>
                <div className="w-9/12">
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="DOI"
                      className={`w-full p-4 rounded-sm border placeholder:text-stone text-base bg-seasalt border-dim [&+div]:focus:opacity-100 [&+div]:focus:visible`}
                      value={resource.resource__doi?.title}
                      onChange={(e) => dispatch(setField({
                        key: 'resource__doi',
                        value: { ...resource.resource__doi, ...{ title: e.target.value } as LinkField }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex w-full flex-row items-center justify-between gap-2">
                <div className="min-w-[104px] max-w-[104px]">DOI Url</div>
                <div className="w-9/12">
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="DOI Url"
                      className={`w-full p-4 rounded-sm border placeholder:text-stone text-base bg-seasalt border-dim [&+div]:focus:opacity-100 [&+div]:focus:visible`}
                      value={resource.resource__doi?.url !== '#' ? resource.resource__doi?.url : ''}
                      onChange={(e) => dispatch(setField({
                        key: 'resource__doi',
                        value: { ...resource.resource__doi, ...{ url: e.target.value } as LinkField }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Preloader color={'secondary'} />
        )}
      </div>
    </main>
  )
}
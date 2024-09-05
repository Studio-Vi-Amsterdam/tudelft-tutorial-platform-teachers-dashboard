import React, { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import TutorialTopSection from './TutorialTopSection'
import TutorialButtonsSection from './TutorialButtonsSection'
import AddChapterSection from './AddChapterSection'
import { ArtictesType, ChapterInterface, EditorState, ResponseKeyword } from 'src/types/types'
import ChapterSection from './ChapterSection'
import EditorSidebar from './EditorSidebar'
import TutorialBottomSection from './TutorialBottomSection'
import { articlesAPI, taxonomiesAPI } from 'src/lib/api'
import { useLocation, useNavigate } from 'react-router-dom'
import { getInfo, reducerParser } from 'src/lib/reducerParser'
import {
  setEditorLoaded,
  setKeywordsProposedList,
  setNewState,
} from 'src/redux/features/editorSlice'
import { useAuth } from 'src/lib/AuthContext'
import TutorialsMeta from './TutorialsMeta'
import CoursesMeta from './CoursesMeta'
import SoftwaresMeta from './SoftwaresMeta'
import SubjectsMeta from './SubjectsMeta'
import Preloader from '../ui/Preloader'
import { useToast } from 'src/lib/use-toast'

const BlogEditor = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAuth()
  const params = new URLSearchParams(useLocation().search)
  const articleType = params.get('type')
  const articleId = params.get('id')
  const navigate = useNavigate()
  const { toast } = useToast()
  useEffect(() => {
    const fetchData = async () => {
      dispatch(setEditorLoaded(false))
      if (articleType && articleId) {
        const keywordsResponse = await taxonomiesAPI
          .getKeywords()
          .then((res) => res.data && res.data.map((item: ResponseKeyword) => item.name))
          .catch((error) => {
            console.error(error)
            return []
          })

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
            const newObject = await reducerParser.parseToReducer(
              response,
              articleType as ArtictesType,
            )
            dispatch(setNewState({ parsedObject: newObject as EditorState }))
          }
          dispatch(setEditorLoaded(true))
        } else if (articleId === 'new') {
          let info = {}
          const extraInfo = await getInfo(articleType as ArtictesType).catch((error) => {
            console.error(error)
            return {
              data: {},
              study: [],
              software_versions: [],
              keywords: [],
              teachers: [],
              categories: [],
            }
          })

          if (articleType === 'tutorials') {
            info = {
              courses: extraInfo.data.courses.length > 0 ? extraInfo.data.courses : [],
              software: extraInfo.data.softwares.length > 0 ? extraInfo.data.softwares : [],
              subjects:
                extraInfo.data.subjects !== undefined
                  ? Object.keys(extraInfo.data.subjects).map((key) => ({
                      id: extraInfo.data.subjects[key].term_id,
                      title: extraInfo.data.subjects[key].name,
                    }))
                  : [],
              secondarySubjects:
                extraInfo.data.secondary_subjects.length > 0
                  ? extraInfo.data.secondary_subjects
                  : [],
              keywords:
                extraInfo.data.keywords.length > 0
                  ? extraInfo.data.keywords.map(({ title }: any) => title)
                  : [],
              teachers:
                extraInfo.data.teachers.length > 0
                  ? extraInfo.data.teachers.map(({ title }: any) => title)
                  : [],
            }
          } else if (articleType === 'courses') {
            info = {
              secondaryStudy: extraInfo.secondary_study.length > 0 ? extraInfo.secondary_study : [],
              primaryStudy: extraInfo.study.length > 0 ? extraInfo.study : [],
              keywords:
                extraInfo.keywords.length > 0
                  ? extraInfo.keywords.map(({ title }: any) => title)
                  : [],
              teachers:
                extraInfo.teachers.length > 0
                  ? extraInfo.teachers.map(({ title }: any) => title)
                  : [],
            }
          } else if (articleType === 'softwares') {
            info = {
              softwareVersions:
                extraInfo.software_versions.length > 0 ? extraInfo.software_versions : [],
              keywords:
                extraInfo.keywords.length > 0
                  ? extraInfo.keywords.map(({ title }: any) => title)
                  : [],
            }
          } else if (articleType === 'subjects') {
            info = {
              categories: extraInfo.categories,
              secondaryCategories: extraInfo.secondary_categories,
            }
          }

          dispatch(
            setNewState({
              parsedObject: undefined,
              articleType: articleType as ArtictesType,
              info,
            }),
          )
          dispatch(setEditorLoaded(true))
        }
        dispatch(setKeywordsProposedList(keywordsResponse))
      }
    }

    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, articleType, articleId])

  const tutorialTitle = useAppSelector((state: RootState) => state.editor.tutorialTop.title)
  const chapters = useAppSelector((state: RootState) => state.editor.chapters)
  const isFetched = useAppSelector((state: RootState) => state.editor.isEditorLoaded)
  if (isAuthenticated) {
    return (
      <main className="container mx-auto flex flex-auto flex-row justify-between">
        <EditorSidebar tutorialTitle={tutorialTitle} />
        <div className="flex w-full flex-col items-start md:pl-12 lg:pl-28 bg-white">
          {isFetched ? (
            <>
              <TutorialButtonsSection />
              <TutorialTopSection tutorialTitle={tutorialTitle} />
              {chapters.length > 0 &&
                chapters.map((chapter: ChapterInterface, index: number) => (
                  <ChapterSection key={index} chapter={chapter} index={index} />
                ))}

              <AddChapterSection />
              <TutorialBottomSection />
              {articleType === 'tutorials' && <TutorialsMeta />}
              {articleType === 'courses' && <CoursesMeta />}
              {articleType === 'softwares' && <SoftwaresMeta />}
              {articleType === 'subjects' && <SubjectsMeta />}
            </>
          ) : (
            <Preloader color={'secondary'} />
          )}
        </div>
      </main>
    )
  } else {
    return <div className="text-center px-6 py-12">You need to login!</div>
  }
}

export default BlogEditor

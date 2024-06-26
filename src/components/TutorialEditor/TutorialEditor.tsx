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
import { useLocation } from 'react-router-dom'
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

const BlogEditor = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAuth()
  const params = new URLSearchParams(useLocation().search)
  const articleType = params.get('type')
  const articleId = params.get('id')

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setEditorLoaded(false))
      if (articleType && articleId) {
        const keywordsResponse = await taxonomiesAPI
          .getKeywords()
          .then((res) => res.data && res.data.map((item: ResponseKeyword) => item.name))

        if (articleId !== 'new') {
          const response = await articlesAPI
            .getSingleArticle(articleType as ArtictesType, parseInt(articleId))
            .then((res) => res.data)

          const newObject = await reducerParser.parseToReducer(
            response,
            articleType as ArtictesType,
          )

          dispatch(setNewState({ parsedObject: newObject as EditorState }))
          dispatch(setEditorLoaded(true))
        } else if (articleId === 'new') {
          let info = {}
          const extraInfo = await getInfo(articleType as ArtictesType)

          if (articleType === 'tutorials') {
            info = {
              software: extraInfo.data.softwares.length > 0 ? extraInfo.data.softwares : [],
              subjects: extraInfo.data.subjects.length > 0 ? extraInfo.data.subjects : [],
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
        dispatch(setEditorLoaded(true))
      }
    }

    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const tutorialTitle = useAppSelector((state: RootState) => state.editor.tutorialTop.title)
  const chapters = useAppSelector((state: RootState) => state.editor.chapters)
  const isFetched = useAppSelector((state: RootState) => state.editor.isEditorLoaded)
  if (isAuthenticated) {
    return (
      <main className="container mx-auto flex flex-auto flex-row justify-between">
        <EditorSidebar tutorialTitle={tutorialTitle} />
        <div className="flex w-3/4 flex-col items-start pl-4">
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
    return <>You need to login!</>
  }
}

export default BlogEditor

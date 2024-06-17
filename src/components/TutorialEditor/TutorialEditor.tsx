import React, { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import TutorialTopSection from './TutorialTopSection'
import TutorialButtonsSection from './TutorialButtonsSection'
import AddChapterSection from './AddChapterSection'
import { ArtictesType, ChapterInterface, ResponseKeyword } from 'src/types/types'
import ChapterSection from './ChapterSection'
import EditorSidebar from './EditorSidebar'
import TutorialBottomSection from './TutorialBottomSection'
import TutorialBelongsToSection from './TutorialBelongsToSection'
import { articlesAPI, taxonomiesAPI } from 'src/lib/api'
import { useLocation } from 'react-router-dom'
import { reducerParser } from 'src/lib/reducerParser'
import { setKeywordsProposedList, setNewState } from 'src/redux/features/editorSlice'
import { useAuth } from 'src/lib/AuthContext'

const BlogEditor = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAuth()
  const params = new URLSearchParams(useLocation().search)
  const articleType = params.get('type')
  const articleId = params.get('id')

  useEffect(() => {
    const fetchData = async () => {
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

          dispatch(setNewState(newObject))
        } else if (articleId === 'new') {
          dispatch(setNewState(undefined))
        }
        dispatch(setKeywordsProposedList(keywordsResponse))
      }
    }
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])
  const tutorialTitle = useAppSelector((state: RootState) => state.editor.tutorialTop.title)
  const chapters = useAppSelector((state: RootState) => state.editor.chapters)
  if (isAuthenticated) {
    return (
      <main className="container mx-auto flex flex-auto flex-row justify-between">
        <EditorSidebar tutorialTitle={tutorialTitle} />
        <div className="flex w-3/4 flex-col items-start pl-4">
          <TutorialButtonsSection />
          <TutorialTopSection tutorialTitle={tutorialTitle} />
          {chapters.length > 0 &&
            chapters.map((chapter: ChapterInterface, index: number) => (
              <ChapterSection key={index} chapter={chapter} index={index} />
            ))}

          <AddChapterSection />
          <TutorialBottomSection />
          <TutorialBelongsToSection />
        </div>
      </main>
    )
  } else {
    return <>You need to login!</>
  }
}

export default BlogEditor

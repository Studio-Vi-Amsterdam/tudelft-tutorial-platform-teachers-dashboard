import { NavigateFunction } from 'react-router-dom'
import { articlesAPI } from './api'
import { ArtictesType } from '@/types/types'

export const sendArticle = async (
  articleType: ArtictesType,
  articleId: string | null,
  parsedObject: any,
  navigate: NavigateFunction,
  successToast: (message: string) => void,
  errorToast: (error: string) => void,
  draft?: boolean,
) => {
  if (articleType && articleId) {
    try {
      if (articleId === 'new') {
        const res = draft
          ? await articlesAPI.postDraftArticle(articleType, parsedObject)
          : await articlesAPI.postArticle(articleType, parsedObject)

        if (res.data.id || res.data.data.id) {
          const newId = res.data.id || res.data.data.id
          navigate(
            `/dashboard/my-tutorials?type=${articleType}&id=${newId}&status=${draft ? 'draft' : 'published'}`,
          )
          successToast(`Article created in "${articleType}"${draft ? ' as draft' : ''}`)
        }
      } else {
        const res = await articlesAPI.updateArticle(articleType, parsedObject)

        if (res.data) {
          navigate(
            `/dashboard/my-tutorials?type=${articleType}&id=${articleId}&status=${draft ? 'draft' : 'published'}`,
          )
          successToast(`Article updated in "${articleType}"${draft ? ' as draft' : ''}`)
        }
      }
    } catch (error: any) {
      console.error(error)
      errorToast(error.message as string)
    }
  }
}

export const sendResource = async (
  articleType: ArtictesType,
  articleId: string | null,
  data: any,
  navigate: NavigateFunction,
  successToast: (message: string) => void,
  errorToast: (error: string) => void,
  draft?: boolean,
) => {
  try {
    if (articleId === 'new') {
      const payload = {...data, ...{ id: articleId, status: draft ? 'draft' : 'publish' }}
      const res = await articlesAPI.postArticle(articleType, payload)
      if (res.data.data.id) {
        navigate(
          `/dashboard/my-resources?type=${articleType}&id=${res.data.data.id}&status=${draft ? 'draft' : 'published'}`,
        )
        successToast(`Resource created in "${articleType}"${draft ? ' as draft' : ''}`)
      }
    } else {
      const payload = {...data, ...{ id: articleId, status: draft ? 'draft' : 'publish' }}
      const res = await articlesAPI.updateArticle(articleType, payload)
      if (res.data) {
        navigate(
          `/dashboard/my-resources?type=${articleType}&id=${articleId}&status=${draft ? 'draft' : 'published'}`,
        )
        successToast(`Resource updated in "${articleType}"${draft ? ' as draft' : ''}`)
      }
    }
  } catch (error: any) {
    console.error(error)
    errorToast(error.message as string)
  }
}

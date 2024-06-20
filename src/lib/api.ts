import axios from 'axios'
import { ArtictesType } from 'src/types/types'
import { getAuthToken } from './cookies'

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_BACKEND_URL,
})

instance.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token && !config.url?.includes('/auth')) {
      config.headers.Authorization = `${token}`
    }
    if (config.url?.includes('/media/upload')) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export const articlesAPI = {
  getArticles(type: ArtictesType) {
    return instance.get(`/${type}/`)
  },
  getSingleArticle(type: ArtictesType, id: number) {
    return instance.get(`/${type}/single/?id=${id}`)
  },
  postArticle(type: ArtictesType, payload: any) {
    return instance.post(`/${type}/create`, payload)
  },
  deleteArticle(type: ArtictesType, id: number) {
    const payload = {
      id,
    }
    return instance.delete(`/${type}/single/delete`, { data: payload })
  },
  updateArticle(type: ArtictesType, payload: any) {
    return instance.put(`/${type}/single/update`, payload)
  },
}

export const chaptersAPI = {
  getArticleChapters(parentId: number) {
    return instance.get(`/chapters/id=${parentId}/`)
  },
  getSingleChapter(chapterId: number) {
    return instance.get(`/chapters/single?id=${chapterId}`)
  },
}

export const taxonomiesAPI = {
  getKeywords() {
    return instance.get('/keywords/')
  },
  createKeyword(keyword: string) {
    const payload = {
      keyword,
    }
    return instance.post('/keywords/create', payload)
  },
}

export const authAPI = {
  auth(token: string) {
    return instance.post('/auth', { auth_key: token })
  },
}

export const mediaAPI = {
  getMedia(params?: string) {
    return instance.get(`/media?${params}`)
  },
  getAllMediaPages() {
    return instance.get('/media/total')
  },
  uploadFiles(formData: FormData) {
    return instance.post('/media/upload', formData)
  },
}

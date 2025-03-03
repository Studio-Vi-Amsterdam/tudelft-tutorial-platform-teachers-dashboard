import { ArtictesType } from 'src/types/types'

export const getStringArticleType = (articleType: ArtictesType) => {
  switch (articleType) {
    case 'tutorials':
      return 'tutorial'
    case 'courses':
      return 'course'
    case 'softwares':
      return 'software'
    case 'subjects':
      return 'subject'

    default:
      return 'tutorial'
  }
}

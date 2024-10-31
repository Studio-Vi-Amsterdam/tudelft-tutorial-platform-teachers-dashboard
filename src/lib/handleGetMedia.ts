import { MediaObjectInterface } from 'src/types/types'
import { mediaAPI } from './api'

interface HandleGetMediaArguments {
  setIsLoading: (value: React.SetStateAction<boolean>) => void
  setMedia: (value: React.SetStateAction<MediaObjectInterface[] | undefined>) => void
  params?: string
}

export const handleGetMedia = (props: HandleGetMediaArguments) => {
  const { setIsLoading, setMedia, params } = props
  setIsLoading(true)
  setMedia(undefined)
  mediaAPI.getMedia(params).then((res) => {
    const newMedia: MediaObjectInterface[] = res.data.map((serverItem: any) => {
      return {
        id: serverItem.id,
        url: serverItem.url,
        type: serverItem.media_type.split('/')[0],
        format: serverItem.media_type.split('/')[1],
        title: serverItem.title,
        publishDate: serverItem.published,
        description: serverItem.description,
        isOwner: serverItem.is_media_owner,
      }
    })
    setMedia(newMedia)
    setIsLoading(false)
  })
}

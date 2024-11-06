export const urlPattern = // eslint-disable-next-line no-useless-escape
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/

export const convertToEmbedUrl = (url: string) => {
  const youtubePattern =
    /(?:https?:\/\/)?(?:www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&?/\s]{11})/
  const vimeoPattern = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:video\/)?(\d+)/

  const youtubeMatch = url.match(youtubePattern)
  if (youtubeMatch && youtubeMatch[3]) {
    const videoId = youtubeMatch[3]
    return `https://www.youtube.com/embed/${videoId}`
  }

  const vimeoMatch = url.match(vimeoPattern)
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1]
    return `https://player.vimeo.com/video/${videoId}`
  }
  return url
}

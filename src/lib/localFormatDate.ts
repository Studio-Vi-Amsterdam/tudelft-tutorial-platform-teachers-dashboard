export const localFormatDate = (dateString: string): string => {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format')
  }
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

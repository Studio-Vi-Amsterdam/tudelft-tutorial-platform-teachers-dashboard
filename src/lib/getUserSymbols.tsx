export const getUserSymbols = (firstName: string, lastName: string) => {
  let name = ''
  if (firstName) {
    name += firstName[0]
  }
  if (lastName) {
    name += lastName[0]
  }
  return name
}

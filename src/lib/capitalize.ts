export const Capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const RemoveLastSymbol = (str: string) => {
  return str.substring(0, str.length - 1)
}

export function abbrCenter(text: string, reduceValue = 4): string {
  if (text.length <= 10) {
    return text
  }
  return `${text.slice(0, reduceValue)}...${text.slice(
    text.length - reduceValue,
    text.length,
  )}`
}

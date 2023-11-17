export function abbrCenter(text: string, reduceValue = 4): string {
  if (text.length <= 10) {
    return text
  }
  return `${text.slice(0, reduceValue)}...${text.slice(
    text.length - reduceValue,
    text.length,
  )}`
}

export const prepareIntegratorLink = (params: {
  questCreatorDetails: {
    name: string
    iconLink: string
  }
  destinationDetails: {
    link: string
    name: string
    iconLink: string
  }
}) => {
  return window.btoa(
    JSON.stringify({
      questCreatorDetails: {
        name: params.questCreatorDetails.name,
        iconLink: params.questCreatorDetails.iconLink,
      },
      destinationDetails: {
        link: params.destinationDetails.link,
        name: params.destinationDetails.name,
        iconLink: params.destinationDetails.iconLink,
      },
    }),
  )
}

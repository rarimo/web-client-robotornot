import { createContext, FC, HTMLAttributes } from 'react'

interface KycContextValue {
  // FIXME
  dummy: string
}

export const kycContext = createContext<KycContextValue>({
  dummy: '',
})

type Props = HTMLAttributes<HTMLDivElement>

const KycContextProvider: FC<Props> = ({ children, ...rest }) => {
  return (
    <kycContext.Provider
      value={{
        dummy: 'dummy',
      }}
      {...rest}
    >
      {children}
    </kycContext.Provider>
  )
}

export default KycContextProvider

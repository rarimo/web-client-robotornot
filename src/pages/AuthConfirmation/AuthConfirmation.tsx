import './styles.scss'

import { SUPPORTED_CHAINS } from '@config'
import { FC, HTMLAttributes, useCallback, useMemo, useState } from 'react'

import { AppButton, Icon } from '@/common'
import { ICON_NAMES } from '@/enums'
import { BasicSelectField } from '@/fields'

type Props = HTMLAttributes<HTMLDivElement>

type ChainToPublish = {
  title: string
  value: string
  iconName: ICON_NAMES
}

const AuthConfirmation: FC<Props> = () => {
  const defaultChainIdToPublish = useMemo<SUPPORTED_CHAINS>(
    () => SUPPORTED_CHAINS.POLYGON,
    [],
  )

  const CHAINS_DETAILS_MAP = useMemo(
    () => ({
      [SUPPORTED_CHAINS.POLYGON]: {
        title: 'Polygon chain',
        value: '1',
        iconName: ICON_NAMES.map,
      },
      [SUPPORTED_CHAINS.SEPOLIA]: {
        title: 'Sepolia chain',
        value: '5',
        iconName: ICON_NAMES.xCircle,
      },
      [SUPPORTED_CHAINS.GOERLI]: {
        title: 'Goerli chain',
        value: '4',
        iconName: ICON_NAMES.arrowRight,
      },
    }),
    [],
  )

  const defaultChainToPublish = useMemo<ChainToPublish>(() => {
    return {
      title: CHAINS_DETAILS_MAP[defaultChainIdToPublish].title,
      value: CHAINS_DETAILS_MAP[defaultChainIdToPublish].value,
      iconName: CHAINS_DETAILS_MAP[defaultChainIdToPublish].iconName,
    }
  }, [CHAINS_DETAILS_MAP, defaultChainIdToPublish])

  const [additionalChainsIdToPublish, setAdditionalChainsIdToPublish] =
    useState<SUPPORTED_CHAINS[]>([])

  const additionalChainsToPublish = useMemo<ChainToPublish[]>(() => {
    return additionalChainsIdToPublish.map(el => ({
      title: CHAINS_DETAILS_MAP[el].title,
      value: CHAINS_DETAILS_MAP[el].value,
      iconName: CHAINS_DETAILS_MAP[el].iconName,
    }))
  }, [CHAINS_DETAILS_MAP, additionalChainsIdToPublish])

  const availableChainsIdsToSet = useMemo<SUPPORTED_CHAINS[]>(() => {
    return Object.values(SUPPORTED_CHAINS).filter(el => {
      return el !== defaultChainIdToPublish
    })
  }, [defaultChainIdToPublish])

  const addChainToPublish = useCallback(() => {
    setAdditionalChainsIdToPublish(prev => [
      ...prev,
      ...(availableChainsIdsToSet?.[0]
        ? [availableChainsIdsToSet[0] as SUPPORTED_CHAINS]
        : []),
    ])
  }, [availableChainsIdsToSet])

  const updateSelectedChainToPublish = useCallback(
    (value: string | number, idx: number) => {
      setAdditionalChainsIdToPublish(prev => {
        const newChains = [...prev]

        newChains[idx] =
          (availableChainsIdsToSet?.find?.(availableChain => {
            return Object.entries(CHAINS_DETAILS_MAP).find(
              ([chain, details]) => {
                return details.value === value && availableChain === chain
              },
            )
          }) as SUPPORTED_CHAINS) ?? prev[idx]

        return newChains
      })
    },
    [CHAINS_DETAILS_MAP, availableChainsIdsToSet],
  )

  return (
    <div className='auth-confirmation'>
      <div className='auth-confirmation__header'>
        <div className='auth-confirmation__header-icon-wrp'>
          <Icon
            className='auth-confirmation__header-icon'
            name={ICON_NAMES.check}
          />
        </div>
        <h2 className='auth-confirmation__header-title'>{`Proof Generated`}</h2>
        <span className='auth-confirmation__header-subtitle'>
          {`Proof is generated using Zero-Knowledge Proof (ZKP) and none of the personal info is shared with any party`}
        </span>
      </div>

      <div className='auth-confirmation__card'>
        <div className='auth-confirmation__card-header'>
          <h5 className='auth-confirmation__card-title'>
            {`Make it available on any chain`}
          </h5>
          <span className='auth-confirmation__card-subtitle'>
            {`Your proof has been published on Polygon as default`}
          </span>
        </div>

        <div className='auth-confirmation__chains'>
          <div className='auth-confirmation__chain-item'>
            <Icon
              className='auth-confirmation__chain-item-icon'
              name={defaultChainToPublish.iconName}
            />
            <span className='auth-confirmation__chain-item-name'>
              {defaultChainToPublish.title}
            </span>
          </div>

          {additionalChainsToPublish?.map?.((el, idx) => (
            <div
              className='auth-confirmation__chain-item auth-confirmation__chain-item--select-wrp'
              key={idx}
            >
              <BasicSelectField
                label={`Select chain`}
                value={el.value}
                updateValue={value => updateSelectedChainToPublish(value, idx)}
                valueOptions={
                  availableChainsIdsToSet?.map?.(availableChain => ({
                    title: CHAINS_DETAILS_MAP[availableChain].title,
                    value: CHAINS_DETAILS_MAP[availableChain].value,
                    iconName: CHAINS_DETAILS_MAP[availableChain].iconName,
                  })) ?? []
                }
              />

              <AppButton
                className='auth-confirmation__chain-item-remove-btn'
                scheme='none'
                color='error'
                size='none'
                iconLeft={ICON_NAMES.trash}
                onClick={() => {
                  setAdditionalChainsIdToPublish(prev => {
                    return [...prev.filter((_, index) => index !== idx)]
                  })
                }}
              />
            </div>
          ))}

          {availableChainsIdsToSet?.length ? (
            <AppButton
              className='auth-confirmation__chain-add-btn'
              scheme='none'
              text={`Add other chain`}
              iconLeft={ICON_NAMES.plus}
              onClick={addChainToPublish}
            />
          ) : (
            <></>
          )}
        </div>

        <div className='auth-confirmation__divider' />

        <AppButton
          className='auth-confirmation__submit-btn'
          text={`SUBMIT PROOF`}
          iconRight={ICON_NAMES.arrowRight}
          size='large'
        />
      </div>
    </div>
  )
}

export default AuthConfirmation

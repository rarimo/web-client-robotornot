import {
  Autocomplete,
  Button,
  CircularProgress,
  Stack,
  TextField,
  useTheme,
} from '@mui/material'
import { Cancel, Search } from 'iconoir-react'
import { KeyboardEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate } from 'react-router-dom'

import { ContentBox, ContentSection } from '@/components'
import { RoutePaths } from '@/enums'
import { Bus } from '@/helpers'
import { useLoading, useSearch } from '@/hooks'
import { SearchQuery } from '@/types'

const DashboardSearch = () => {
  const [searchValue, setSearchValue] = useState('')

  const { t } = useTranslation()
  const { loadSearchResults } = useSearch()
  const navigate = useNavigate()
  const theme = useTheme()

  const {
    data: searchResult,
    isLoading,
    reload,
  } = useLoading<SearchQuery>(
    {
      transaction: [],
      block: [],
      account: [],
    },
    () => loadSearchResults(searchValue),
    { loadOnMount: false },
  )
  useEffect(() => {
    if (!searchValue) return
    const { transaction, account, block } = searchResult

    let path = ''
    if (transaction?.length) {
      path = generatePath(RoutePaths.Transaction, {
        hash: transaction?.[0]?.hash ?? '',
      })
    }

    if (block?.length) {
      path = generatePath(RoutePaths.Block, {
        height: block?.[0]?.height ?? '',
      })
    }

    if (account?.length) {
      path = generatePath(RoutePaths.Account, {
        address: account?.[0]?.address ?? '',
      })
    }

    if (!path && !isLoading) {
      Bus.info(t('dashboard-search.no-results-msg'))
      return
    }

    navigate(path)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResult])

  const handleEnterPress = async (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter') return
    reload()
  }

  return (
    <ContentSection title={t('dashboard-search.heading')}>
      <Stack alignItems='center' justifyContent='center'>
        <ContentBox
          sx={{
            width: '100%',
            maxWidth: 600,
          }}
        >
          <Stack flexDirection={'row'}>
            <Autocomplete
              freeSolo
              clearIcon={<Cancel />}
              selectOnFocus
              options={[]}
              sx={{
                width: '100%',
                '.MuiAutocomplete-endAdornment': {
                  top: 'unset',
                },
                '&.MuiAutocomplete-hasClearIcon .MuiOutlinedInput-root': {
                  paddingRight: isLoading ? '1px' : '39px',
                },
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  value={searchValue}
                  onChange={event => setSearchValue(event.target.value)}
                  focused
                  onKeyDown={handleEnterPress}
                  placeholder={t('dashboard-search.search-placeholder')}
                  sx={{
                    '& > .MuiInputBase-root': {
                      paddingRight: '1px',
                    },
                  }}
                  InputProps={{
                    ...(isLoading
                      ? {
                          endAdornment: (
                            <CircularProgress
                              sx={{
                                mr: theme.spacing(2),
                              }}
                              size={24}
                            />
                          ),
                        }
                      : params.InputProps),
                  }}
                />
              )}
            />
            <Button
              sx={{
                maxWidth: 56,
                p: '10px 16px',
                height: 56,
                ml: 1,
              }}
              onClick={reload}
              disabled={!searchValue}
            >
              <Search width={36} height={36} />
            </Button>
          </Stack>
        </ContentBox>
      </Stack>
    </ContentSection>
  )
}

export default DashboardSearch

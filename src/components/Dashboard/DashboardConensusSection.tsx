import { Stack, useTheme } from '@mui/material'

import { ContentBox, ContentSection, DashboardConsensus } from '@/components'

const DashboardConsensusSection = () => {
  const theme = useTheme()
  const itemProps = { sx: { flex: 1, minWidth: 0 } }

  return (
    <ContentSection>
      <Stack spacing={theme.spacing(2)} direction={{ xs: 'column', md: 'row' }}>
        <ContentBox {...itemProps}>
          <DashboardConsensus />
        </ContentBox>
      </Stack>
    </ContentSection>
  )
}
export default DashboardConsensusSection

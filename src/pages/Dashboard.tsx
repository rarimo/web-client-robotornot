import {
  DashboardLatestDataSection,
  DashboardSearch,
  DashboardStatistic,
  PageContainer,
  TokenomicsConsensusSection,
} from '@/components'

const Dashboard = () => {
  return (
    <PageContainer>
      <DashboardSearch />
      <DashboardStatistic />
      <TokenomicsConsensusSection />
      <DashboardLatestDataSection />
    </PageContainer>
  )
}

export default Dashboard

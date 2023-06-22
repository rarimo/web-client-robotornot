import {
  PageContainer,
  ProposalDepositsSection,
  ProposalDetailsSection,
  ProposalVotesSection,
} from '@/components'

const Proposal = () => {
  return (
    <PageContainer>
      <ProposalDetailsSection />
      <ProposalDepositsSection />
      <ProposalVotesSection />
    </PageContainer>
  )
}

export default Proposal

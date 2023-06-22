import { TFunction } from 'i18next'

export const localizeMsgType = (t: TFunction, type: string) =>
  ({
    '/cosmos.authz.v1beta1.MsgGrant': t('message-types.grant-lbl'),
    '/cosmos.authz.v1beta1.MsgRevoke': t('message-types.revoke-lbl'),
    '/cosmos.authz.v1beta1.MsgExec': t('message-types.exec-lbl'),
    '/cosmos.bank.v1beta1.MsgSend': t('message-types.send-lbl'),
    '/cosmos.bank.v1beta1.MsgMultiSend': t('message-types.multi-send-lbl'),
    '/cosmos.crisis.v1beta1.MsgVerifyInvariant': t(
      'message-types.verify-invariant-lbl',
    ),
    '/cosmos.distribution.v1beta1.MsgFundCommunityPool': t(
      'message-types.fund-community-pool-lbl',
    ),
    '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward': t(
      'message-types.withdraw-delegator-reward-lbl',
    ),
    '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission': t(
      'message-types.withdraw-validator-commission-lbl',
    ),
    '/cosmos.distribution.v1beta1.MsgSetWithdrawAddress': t(
      'message-types.set-withdraw-address-lbl',
    ),
    '/cosmos.evidence.v1beta1.MsgSubmitEvidence': t(
      'message-types.submit-evidence-lbl',
    ),
    '/cosmos.feegrant.v1beta1.MsgRevokeAllowance': t(
      'message-types.revoke-allowance-lbl',
    ),
    '/cosmos.feegrant.v1beta1.MsgGrantAllowance': t(
      'message-types.grant-allowance-lbl',
    ),
    '/cosmos.gov.v1beta1.MsgDeposit': t('message-types.deposit-lbl'),
    '/cosmos.gov.v1beta1.MsgVote': t('message-types.vote-proposal-lbl'),
    '/cosmos.gov.v1beta1.MsgVoteWeighted': t('message-types.vote-weighted-lbl'),
    '/cosmos.gov.v1beta1.MsgSubmitProposal': t(
      'message-types.submit-proposal-lbl',
    ),
    '/cosmos.slashing.v1beta1.MsgUnjail': t('message-types.unjail-lbl'),
    '/cosmos.staking.v1beta1.MsgBeginRedelegate': t(
      'message-types.begin-redelegate-lbl',
    ),
    '/cosmos.staking.v1beta1.MsgCreateValidator': t(
      'message-types.create-validator-lbl',
    ),
    '/cosmos.staking.v1beta1.MsgEditValidator': t(
      'message-types.edit-validator-lbl',
    ),
    '/cosmos.staking.v1beta1.MsgDelegate': t('message-types.delegate-lbl'),
    '/cosmos.staking.v1beta1.MsgUndelegate': t('message-types.undelegate-lbl'),
    '/cosmos.vesting.v1beta1.MsgCreateVestingAccount': t(
      'message-types.create-vesting-account-lbl',
    ),
    '/ibc.applications.transfer.v1.MsgTransfer': t(
      'message-types.transfer-lbl',
    ),

    '/rarimo.rarimocore.rarimocore.MsgCreateChangePartiesOp': t(
      'message-types.create-change-parties-op-lbl',
    ),
    '/rarimo.rarimocore.rarimocore.MsgSetupInitial': t(
      'message-types.setup-initial-lbl',
    ),
    '/rarimo.rarimocore.rarimocore.MsgCreateTransferOp': t(
      'message-types.create-transfer-op-lbl',
    ),
    '/rarimo.rarimocore.rarimocore.MsgCreateConfirmation': t(
      'message-types.create-confirmation-lbl',
    ),
    '/rarimo.rarimocore.rarimocore.MsgVote': t(
      'message-types.vote-operation-lbl',
    ),
    '/rarimo.rarimocore.rarimocore.MsgCreateViolationReport': t(
      'message-types.create-violation-report-lbl',
    ),
    '/rarimo.rarimocore.rarimocore.MsgStake': t('message-types.tss-stake-lbl'),
    '/rarimo.rarimocore.rarimocore.MsgUnstake': t(
      'message-types.tss-unstake-lbl',
    ),
    '/rarimo.rarimocore.rarimocore.MsgChangePartyAddress': t(
      'message-types.change-parties-address-lbl',
    ),

    '/rarimo.rarimocore.tokenmanager.MsgDeleteInfo': t(
      'message-types.delete-info-lbl',
    ),
    '/rarimo.rarimocore.tokenmanager.MsgCreateInfo': t(
      'message-types.create-info-lbl',
    ),
    '/rarimo.rarimocore.tokenmanager.MsgAddChain': t(
      'message-types.add-chain-lbl',
    ),

    '/rarimo.rarimocore.bridge.MsgDepositNative': t(
      'message-types.deposit-native-lbl',
    ),
    '/rarimo.rarimocore.bridge.MsgWithdrawNative': t(
      'message-types.withdraw-native-lbl',
    ),

    '/rarimo.rarimocore.multisig.MsgSubmitProposal': t(
      'message-types.multisig-submit-proposal-lbl',
    ),
    '/rarimo.rarimocore.multisig.MsgVote': t('message-types.multisig-vote-lbl'),
    '/rarimo.rarimocore.multisig.MsgCreateGroup': t(
      'message-types.vote-response-lbl',
    ),
    '/rarimo.rarimocore.multisig.MsgChangeGroup': t(
      'message-types.create-group-lbl',
    ),

    '/rarimo.rarimocore.oraclemanager.MsgStake': t('message-types.stake-lbl'),
    '/rarimo.rarimocore.oraclemanager.MsgUnstake': t(
      'message-types.unstake-lbl',
    ),
    '/rarimo.rarimocore.oraclemanager.MsgCreateTransferOp': t(
      'message-types.create-transfer-op-lbl',
    ),
    '/rarimo.rarimocore.oraclemanager.MsgVote': t(
      'message-types.oracle-vote-lbl',
    ),
    '/rarimo.rarimocore.oraclemanager.MsgUnjail': t(
      'message-types.oracle-unjail-lbl',
    ),
  }[type])

import React, { useCallback } from 'react'
import clsx from 'clsx'

import { Proposal as ProposalType, Vote } from 'types'
import VoteMeter from 'components/VoteMeter'
import ProposalStatusBadge from 'components/ProposalStatusBadge'
import { usePushRoute } from 'utils/effects'
import { proposalPage } from 'utils/routes'
import { leftPadZero, getHumanReadableTime, getDate } from 'utils/format'
import { useProposalTimeRemaining } from 'store/cache/proposals/hooks'
import ProposalStatusChip from 'components/ProposalStatusChip'
import Voted from 'components/Voted'
import { createStyles } from 'utils/mobile'

import desktopStyles from './Proposal.module.css'
import mobileStyles from './ProposalMobile.module.css'

const styles = createStyles({ desktopStyles, mobileStyles })

const messages = {
  timeRemaining: 'remaining'
}

type OwnProps = {
  className?: string
  header?: string
  proposal: ProposalType
  // Whether or not to include voter information
  vote?: Vote
  onClick?: () => void
}

type ProposalProps = OwnProps

const Proposal: React.FC<ProposalProps> = ({
  header,
  proposal,
  vote,
  className,
  onClick
}) => {
  const pushRoute = usePushRoute()
  const onClickProposal = useCallback(() => {
    if (onClick) onClick()
    pushRoute(proposalPage(proposal.proposalId))
  }, [proposal, pushRoute, onClick])
  const { timeRemaining } = useProposalTimeRemaining(
    proposal.submissionBlockNumber
  )

  const evaluatedBlockTimestamp = proposal?.evaluatedBlock?.timestamp ?? null

  return (
    <div
      className={clsx(styles.proposal, { [className!]: !!className })}
      onClick={onClickProposal}
    >
      <div className={styles.left}>
        {header && <div className={styles.header}>{header}</div>}
        <div className={styles.name}>
          {proposal.name || proposal.description || proposal.functionSignature}
        </div>
        <div className={clsx(styles.info, { [styles.infoHeader]: !!header })}>
          <ProposalStatusBadge outcome={proposal.outcome} />
          <div className={styles.id}>{leftPadZero(proposal.proposalId, 3)}</div>
          {evaluatedBlockTimestamp ? (
            <div className={styles.executed}>
              {`Executed ${getDate(evaluatedBlockTimestamp * 1000)}`}
            </div>
          ) : (
            <div
              className={clsx(styles.timeRemaining, {
                [styles.show]: timeRemaining
              })}
            >
              {timeRemaining &&
                `${getHumanReadableTime(timeRemaining)} ${
                  messages.timeRemaining
                }`}
            </div>
          )}
        </div>
      </div>
      <div className={styles.right}>
        {!!vote ? (
          <Voted vote={vote} />
        ) : proposal?.evaluatedBlock ? (
          <ProposalStatusChip outcome={proposal.outcome} />
        ) : (
          <VoteMeter
            votesFor={proposal.voteMagnitudeYes}
            votesAgainst={proposal.voteMagnitudeNo}
          />
        )}
      </div>
    </div>
  )
}

export default Proposal

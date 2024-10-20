import { ReactElement, useCallback, useEffect, useMemo } from 'react'

import { useSelectTierInfo } from '@audius/common/hooks'
import { BadgeTier } from '@audius/common/models'
import {
  accountSelectors,
  badgeTiers,
  getTierNumber,
  vipDiscordModalActions,
  musicConfettiActions
} from '@audius/common/store'
import { Nullable } from '@audius/common/utils'
import {
  IconArrowRight as IconArrow,
  IconTokenBronze,
  IconTokenGold,
  IconTokenPlatinum,
  IconTokenSilver,
  IconDiscord,
  Button,
  Box
} from '@audius/harmony'
import cn from 'classnames'
import { useDispatch } from 'react-redux'

import { BadgeTierText } from 'components/user-badges/ProfilePageBadge'
import { useIsMobile } from 'hooks/useIsMobile'
import { useWithMobileStyle } from 'hooks/useWithMobileStyle'
import { useSelector } from 'utils/reducer'

import styles from './Tiers.module.css'
const { show } = musicConfettiActions
const { pressDiscord } = vipDiscordModalActions
const getAccountUser = accountSelectors.getAccountUser

const messages = {
  title: '$AUDIO VIP TIERS',
  subtitle1: `Unlock $AUDIO VIP Tiers by simply holding more $AUDIO!`,
  subtitle2: `Advancing to a new tier will earn your profile a badge, visible throughout the app, and unlock various new features as they are released.`,
  unlocks: 'UNLOCKS',
  badgeType: (badge: string) => `${badge} Badge`,
  badgeRole: (badge: string) => `${badge} Discord Role`,
  moreSoon: 'More Coming Soon!',
  updateRole: 'Update Role',
  tierNumber: (tier: number) => `TIER ${tier}`,
  currentTier: 'CURRENT TIER',
  learnMore: 'Learn more',
  launchDiscord: 'Launch the VIP Discord',
  tierLevel: (amount: string) => `${Number(amount).toLocaleString()}+ $AUDIO`,
  matrixMode: 'Matrix Mode'
}

type AudioTiers = Exclude<BadgeTier, 'none'>

// Tiers as they are listed here, in order
const tiers: AudioTiers[] = ['bronze', 'silver', 'gold', 'platinum']
const BADGE_SIZE = 108

// Mapping for large icons
export const audioTierMapSvg: {
  [tier in AudioTiers]: Nullable<ReactElement>
} = {
  bronze: <IconTokenBronze width={BADGE_SIZE} height={BADGE_SIZE} />,
  silver: <IconTokenSilver width={BADGE_SIZE} height={BADGE_SIZE} />,
  gold: <IconTokenGold width={BADGE_SIZE} height={BADGE_SIZE} />,
  platinum: <IconTokenPlatinum width={BADGE_SIZE} height={BADGE_SIZE} />
}

const BADGE_LOCAL_STORAGE_KEY = 'last_badge_tier'

export const LEARN_MORE_URL = 'http://blog.audius.co/posts/community-meet-audio'

const useShowConfetti = (tier: BadgeTier) => {
  // No tier or no local storage, never show confetti
  if (tier === 'none' || !window.localStorage) return false

  const lastBadge = window.localStorage.getItem(BADGE_LOCAL_STORAGE_KEY) as
    | BadgeTier
    | undefined

  // set last tier
  window.localStorage.setItem(BADGE_LOCAL_STORAGE_KEY, tier)

  // if we just got our first tier, always show confetti
  if (!lastBadge) return true

  const [oldTierNum, newTierNum] = [
    getTierNumber(lastBadge),
    getTierNumber(tier)
  ]

  return newTierNum > oldTierNum
}

/** Renders out the level # associated with a given tier */
export const TierNumber = ({ tier }: { tier: AudioTiers }) => {
  const tierNumber = tiers.findIndex((t) => t === tier) + 1
  return (
    <span className={styles.tierNumberText}>
      {messages.tierNumber(tierNumber)}
    </span>
  )
}

/** Renders out level of audio required for a tier - e.g. '1000+ $AUDIO */
export const TierLevel = ({ tier }: { tier: AudioTiers }) => {
  const minAudio = useMemo(
    () => badgeTiers.find((b) => b.tier === tier)?.minAudio.toString() ?? '',
    [tier]
  )
  return <div className={styles.tierLevel}>{messages.tierLevel(minAudio)}</div>
}

type TierProps = {
  isActive?: boolean
  tier: AudioTiers
  isCompact?: boolean
  onClickDiscord?: () => void
}

/** Shows info about a tier - badge, level, tier # */
export const Tier = ({
  tier,
  isActive = false,
  isCompact = false,
  onClickDiscord = () => {}
}: TierProps) => {
  const badgeImage = audioTierMapSvg[tier]

  return (
    <div
      className={cn(styles.tierContainerWrapper, {
        [styles.tierContainerActive]: isActive,
        [styles.compact]: isCompact
      })}
    >
      {isActive && (
        <div className={styles.currentTier}>
          {messages.currentTier}
          <div className={styles.arrowWrapper}>
            <IconArrow />
          </div>
        </div>
      )}
      <div
        className={cn(
          styles.tierContainer,
          {
            [styles.tierContainerActive]: isActive
          },
          {
            [styles.compact]: isCompact
          }
        )}
      >
        <TierNumber tier={tier} />
        <BadgeTierText
          tier={tier}
          fontSize={28}
          className={styles.badgeTierText}
        />
        <TierLevel tier={tier} />
        <div className={styles.divider} />
        <div className={styles.imageWrapper}>{badgeImage}</div>
        {!isCompact && (
          <>
            <div className={styles.unlocks}>{messages.unlocks}</div>
            <div className={styles.tierTextContainer}>
              <span>
                <i className='emoji large white-heavy-check-mark' />
                {messages.badgeType(tier)}
              </span>
              <span>
                <i className='emoji large white-heavy-check-mark' />
                {messages.badgeRole(tier)}
              </span>
              {(tier === 'gold' || tier === 'platinum') && (
                <span>
                  <i className='emoji large rabbit' />
                  <i className='emoji large hole' />
                  {messages.matrixMode}
                </span>
              )}
              {isActive && (
                <Box mb='s' w='100%'>
                  <Button
                    variant='secondary'
                    size='small'
                    iconLeft={IconDiscord}
                    onClick={onClickDiscord}
                    fullWidth
                  >
                    {messages.updateRole}
                  </Button>
                </Box>
              )}
              <span className={styles.sparkles}>
                <i className='emoji large sparkles' />
                {messages.moreSoon}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/** Tile with multiple tiers */
const Tiers = () => {
  const accountUser = useSelector(getAccountUser)
  const userId = accountUser?.user_id ?? 0
  const { tier } = useSelectTierInfo(userId)

  const dispatch = useDispatch()
  const onClickDiscord = useCallback(() => dispatch(pressDiscord()), [dispatch])
  const onClickExplainMore = useCallback(() => {
    window.open(LEARN_MORE_URL, '_blank')
  }, [])

  const showConfetti = useShowConfetti(tier)
  useEffect(() => {
    if (showConfetti) {
      dispatch(show())
    }
  }, [showConfetti, dispatch])

  const wm = useWithMobileStyle(styles.mobile)

  const isMobile = useIsMobile()

  return (
    <div className={styles.container}>
      <div className={wm(styles.tileContainerWrapper)}></div>
      <div className={wm(styles.titleContainer)}>
        <div className={wm(styles.title)}>{messages.title}</div>
        <div className={wm(styles.subtitle)}>{messages.subtitle1}</div>
        <div className={wm(styles.subtitle)}>{messages.subtitle2}</div>
      </div>
      <div className={wm(styles.tiersContainer)}>
        {tiers.map((t) => (
          <Tier
            tier={t}
            isActive={tier === t}
            key={t}
            onClickDiscord={onClickDiscord}
            isCompact={isMobile}
          />
        ))}
      </div>
      <div className={wm(styles.buttonContainer)}>
        <Button variant='secondary' onClick={onClickExplainMore}>
          {messages.learnMore}
        </Button>
        <Button
          variant='secondary'
          iconLeft={IconDiscord}
          onClick={onClickDiscord}
        >
          {messages.launchDiscord}
        </Button>
      </div>
    </div>
  )
}

export default Tiers

import { useCurrentCommentSection } from '@audius/common/context'
import { ID } from '@audius/common/models'
import { tippingSelectors } from '@audius/common/store'
import {
  Flex,
  IconComponent,
  IconStar,
  IconTipping,
  IconTrophy,
  Text
} from '@audius/harmony'
import { useSelector } from 'react-redux'

const { getSupporters } = tippingSelectors

type BadgeType = 'artist' | 'topSupporter' | 'tipSupporter'

const iconMap: Record<BadgeType, IconComponent> = {
  artist: IconStar,
  topSupporter: IconTrophy,
  tipSupporter: IconTipping
}
const messages: Record<BadgeType, string> = {
  artist: 'Artist',
  topSupporter: 'Top Supporter',
  tipSupporter: 'Tip Supporter'
}

const Badge = ({ type }: { type: BadgeType | null }) => {
  if (type === null) return null

  const Icon = iconMap[type]
  return (
    <Flex gap='xs'>
      <Icon color='accent' size='xs' />
      <Text color='accent' variant='body' size='xs'>
        {messages[type]}
      </Text>
    </Flex>
  )
}

type CommentBadgeProps = {
  isArtist: boolean
  commentUserId: ID
}

export const CommentBadge = ({
  commentUserId,
  isArtist
}: CommentBadgeProps) => {
  const { artistId } = useCurrentCommentSection()
  const supporters = useSelector(getSupporters)
  const tipSupporterData = supporters?.[artistId]?.[commentUserId]
  const isTipSupporter = tipSupporterData !== undefined
  const isTopSupporter = tipSupporterData?.rank === 1
  const badgeType = isArtist
    ? 'artist'
    : isTopSupporter
    ? 'topSupporter'
    : isTipSupporter
    ? 'tipSupporter'
    : null
  return <Badge type={badgeType} />
}

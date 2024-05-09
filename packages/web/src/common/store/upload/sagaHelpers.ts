import {
  Name,
  isContentCollectibleGated,
  isContentFollowGated,
  isContentTipGated,
  isContentUSDCPurchaseGated,
  TrackMetadata,
  USDCPurchaseConditions
} from '@audius/common/models'
import { FeatureFlags } from '@audius/common/services'
import {
  accountSelectors,
  getUSDCUserBank,
  getContext,
  TrackForUpload
} from '@audius/common/store'
import { BN_USDC_CENT_WEI } from '@audius/common/utils'
import BN from 'bn.js'
import { all, call, put, select } from 'typed-redux-saga'

import { make } from 'common/store/analytics/actions'
const { getAccountUser } = accountSelectors

/** Records gated track uploads. */
export function* recordGatedTracks(tracks: (TrackForUpload | TrackMetadata)[]) {
  const events = tracks.reduce<ReturnType<typeof make>[]>(
    (out, trackOrMetadata) => {
      const {
        is_stream_gated: isStreamGated,
        stream_conditions: streamConditions,
        is_download_gated: isDownloadGated,
        download_conditions: dowloadConditions,
        is_downloadable: isDownloadable,
        is_original_available: isOriginalAvailable
      } = 'metadata' in trackOrMetadata
        ? trackOrMetadata.metadata
        : trackOrMetadata
      if (isStreamGated && streamConditions) {
        if (isContentCollectibleGated(streamConditions)) {
          out.push(
            make(Name.TRACK_UPLOAD_COLLECTIBLE_GATED, {
              kind: 'tracks',
              downloadable: isDownloadable,
              lossless: isOriginalAvailable
            })
          )
        } else if (isContentFollowGated(streamConditions)) {
          out.push(
            make(Name.TRACK_UPLOAD_FOLLOW_GATED, {
              kind: 'tracks',
              downloadable: isDownloadable,
              lossless: isOriginalAvailable
            })
          )
        } else if (isContentTipGated(streamConditions)) {
          out.push(
            make(Name.TRACK_UPLOAD_TIP_GATED, {
              kind: 'tracks',
              downloadable: isDownloadable,
              lossless: isOriginalAvailable
            })
          )
        } else if (isContentUSDCPurchaseGated(streamConditions)) {
          out.push(
            make(Name.TRACK_UPLOAD_USDC_GATED, {
              kind: 'tracks',
              price: streamConditions.usdc_purchase.price / 100,
              downloadable: isDownloadable,
              lossless: isOriginalAvailable
            })
          )
        }
      } else if (isDownloadGated && dowloadConditions) {
        if (isContentFollowGated(dowloadConditions)) {
          out.push(
            make(Name.TRACK_UPLOAD_FOLLOW_GATED_DOWNLOAD, {
              kind: 'tracks',
              downloadable: isDownloadable,
              lossless: isOriginalAvailable
            })
          )
        } else if (isContentUSDCPurchaseGated(dowloadConditions)) {
          out.push(
            make(Name.TRACK_UPLOAD_USDC_GATED_DOWNLOAD, {
              kind: 'tracks',
              price: dowloadConditions.usdc_purchase.price / 100,
              downloadable: isDownloadable,
              lossless: isOriginalAvailable
            })
          )
        }
      }
      return out
    },
    []
  )

  yield* all(events.map((e) => put(e)))
}

export function* getUSDCMetadata(stream_conditions: USDCPurchaseConditions) {
  const ownerAccount = yield* select(getAccountUser)
  const wallet = ownerAccount?.erc_wallet ?? ownerAccount?.wallet
  const ownerUserbank = yield* call(getUSDCUserBank, wallet)
  const priceCents = stream_conditions.usdc_purchase.price
  const priceWei = new BN(priceCents).mul(BN_USDC_CENT_WEI).toNumber()
  const conditionsWithMetadata: USDCPurchaseConditions = {
    usdc_purchase: {
      price: priceCents,
      splits: {
        [ownerUserbank?.toString() ?? '']: priceWei
      }
    }
  }
  return conditionsWithMetadata
}

/**
 * Adds relevant premium metadata
 * Converts prices to WEI and adds splits for USDC purchasable content.
 */
export function* addPremiumMetadata<T extends TrackMetadata>(track: T) {
  const getFeatureEnabled = yield* getContext('getFeatureEnabled')
  const isUsdcPurchaseEnabled = yield* call(
    getFeatureEnabled,
    FeatureFlags.USDC_PURCHASES
  )
  if (!isUsdcPurchaseEnabled) return track

  if (isContentUSDCPurchaseGated(track.stream_conditions)) {
    track.stream_conditions = yield* call(
      getUSDCMetadata,
      track.stream_conditions
    )
  }

  if (isContentUSDCPurchaseGated(track.download_conditions)) {
    track.download_conditions = yield* call(
      getUSDCMetadata,
      track.download_conditions
    )
  }

  return track
}

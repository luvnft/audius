/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/**
 * API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { Access } from './Access';
import {
    AccessFromJSON,
    AccessFromJSONTyped,
    AccessToJSON,
} from './Access';
import type { AccessGate } from './AccessGate';
import {
    AccessGateFromJSON,
    AccessGateFromJSONTyped,
    AccessGateToJSON,
} from './AccessGate';
import type { CoverArt } from './CoverArt';
import {
    CoverArtFromJSON,
    CoverArtFromJSONTyped,
    CoverArtToJSON,
} from './CoverArt';
import type { Favorite } from './Favorite';
import {
    FavoriteFromJSON,
    FavoriteFromJSONTyped,
    FavoriteToJSON,
} from './Favorite';
import type { FieldVisibility } from './FieldVisibility';
import {
    FieldVisibilityFromJSON,
    FieldVisibilityFromJSONTyped,
    FieldVisibilityToJSON,
} from './FieldVisibility';
import type { FullRemixParent } from './FullRemixParent';
import {
    FullRemixParentFromJSON,
    FullRemixParentFromJSONTyped,
    FullRemixParentToJSON,
} from './FullRemixParent';
import type { Repost } from './Repost';
import {
    RepostFromJSON,
    RepostFromJSONTyped,
    RepostToJSON,
} from './Repost';
import type { StemParent } from './StemParent';
import {
    StemParentFromJSON,
    StemParentFromJSONTyped,
    StemParentToJSON,
} from './StemParent';
import type { TrackArtwork } from './TrackArtwork';
import {
    TrackArtworkFromJSON,
    TrackArtworkFromJSONTyped,
    TrackArtworkToJSON,
} from './TrackArtwork';
import type { TrackSegment } from './TrackSegment';
import {
    TrackSegmentFromJSON,
    TrackSegmentFromJSONTyped,
    TrackSegmentToJSON,
} from './TrackSegment';
import type { UserFull } from './UserFull';
import {
    UserFullFromJSON,
    UserFullFromJSONTyped,
    UserFullToJSON,
} from './UserFull';

/**
 * 
 * @export
 * @interface SearchTrackFull
 */
export interface SearchTrackFull {
    /**
     * 
     * @type {TrackArtwork}
     * @memberof SearchTrackFull
     */
    artwork: TrackArtwork;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    genre: string;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    trackCid?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    previewCid?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    origFileCid?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    origFilename?: string;
    /**
     * 
     * @type {boolean}
     * @memberof SearchTrackFull
     */
    isOriginalAvailable: boolean;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    mood?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    releaseDate?: string;
    /**
     * 
     * @type {FullRemixParent}
     * @memberof SearchTrackFull
     */
    remixOf: FullRemixParent;
    /**
     * 
     * @type {number}
     * @memberof SearchTrackFull
     */
    repostCount: number;
    /**
     * 
     * @type {number}
     * @memberof SearchTrackFull
     */
    favoriteCount: number;
    /**
     * 
     * @type {number}
     * @memberof SearchTrackFull
     */
    commentCount: number;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    tags?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    title: string;
    /**
     * 
     * @type {UserFull}
     * @memberof SearchTrackFull
     */
    user: UserFull;
    /**
     * 
     * @type {number}
     * @memberof SearchTrackFull
     */
    duration: number;
    /**
     * 
     * @type {boolean}
     * @memberof SearchTrackFull
     */
    isDownloadable: boolean;
    /**
     * 
     * @type {number}
     * @memberof SearchTrackFull
     */
    playCount: number;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    permalink: string;
    /**
     * 
     * @type {boolean}
     * @memberof SearchTrackFull
     */
    isStreamable?: boolean;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    ddexApp?: string;
    /**
     * 
     * @type {Array<number>}
     * @memberof SearchTrackFull
     */
    playlistsContainingTrack?: Array<number>;
    /**
     * 
     * @type {number}
     * @memberof SearchTrackFull
     */
    pinnedCommentId?: number;
    /**
     * Describes what access the given user has
     * @type {Access}
     * @memberof SearchTrackFull
     */
    access: Access;
    /**
     * The blocknumber this track was last updated
     * @type {number}
     * @memberof SearchTrackFull
     */
    blocknumber: number;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    createDate?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    coverArtSizes: string;
    /**
     * 
     * @type {CoverArt}
     * @memberof SearchTrackFull
     */
    coverArtCids?: CoverArt;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    createdAt: string;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    creditsSplits?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    isrc?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    license?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    iswc?: string;
    /**
     * 
     * @type {FieldVisibility}
     * @memberof SearchTrackFull
     */
    fieldVisibility: FieldVisibility;
    /**
     * 
     * @type {Array<Repost>}
     * @memberof SearchTrackFull
     */
    followeeReposts?: Array<Repost>;
    /**
     * 
     * @type {boolean}
     * @memberof SearchTrackFull
     */
    hasCurrentUserReposted: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof SearchTrackFull
     */
    isScheduledRelease: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof SearchTrackFull
     */
    isUnlisted: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof SearchTrackFull
     */
    hasCurrentUserSaved: boolean;
    /**
     * 
     * @type {Array<Favorite>}
     * @memberof SearchTrackFull
     */
    followeeFavorites?: Array<Favorite>;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    routeId: string;
    /**
     * 
     * @type {StemParent}
     * @memberof SearchTrackFull
     */
    stemOf?: StemParent;
    /**
     * 
     * @type {Array<TrackSegment>}
     * @memberof SearchTrackFull
     */
    trackSegments: Array<TrackSegment>;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    updatedAt: string;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    userId: string;
    /**
     * 
     * @type {boolean}
     * @memberof SearchTrackFull
     */
    isDelete: boolean;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    coverArt?: string;
    /**
     * 
     * @type {boolean}
     * @memberof SearchTrackFull
     */
    isAvailable: boolean;
    /**
     * 
     * @type {number}
     * @memberof SearchTrackFull
     */
    aiAttributionUserId?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof SearchTrackFull
     */
    allowedApiKeys?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    audioUploadId?: string;
    /**
     * 
     * @type {number}
     * @memberof SearchTrackFull
     */
    previewStartSeconds?: number;
    /**
     * 
     * @type {number}
     * @memberof SearchTrackFull
     */
    bpm?: number;
    /**
     * 
     * @type {boolean}
     * @memberof SearchTrackFull
     */
    isCustomBpm?: boolean;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    musicalKey?: string;
    /**
     * 
     * @type {boolean}
     * @memberof SearchTrackFull
     */
    isCustomMusicalKey?: boolean;
    /**
     * 
     * @type {number}
     * @memberof SearchTrackFull
     */
    audioAnalysisErrorCount?: number;
    /**
     * 
     * @type {boolean}
     * @memberof SearchTrackFull
     */
    commentsDisabled?: boolean;
    /**
     * 
     * @type {object}
     * @memberof SearchTrackFull
     */
    ddexReleaseIds?: object;
    /**
     * 
     * @type {Array<object>}
     * @memberof SearchTrackFull
     */
    artists?: Array<object>;
    /**
     * 
     * @type {Array<object>}
     * @memberof SearchTrackFull
     */
    resourceContributors?: Array<object>;
    /**
     * 
     * @type {Array<object>}
     * @memberof SearchTrackFull
     */
    indirectResourceContributors?: Array<object>;
    /**
     * 
     * @type {object}
     * @memberof SearchTrackFull
     */
    rightsController?: object;
    /**
     * 
     * @type {object}
     * @memberof SearchTrackFull
     */
    copyrightLine?: object;
    /**
     * 
     * @type {object}
     * @memberof SearchTrackFull
     */
    producerCopyrightLine?: object;
    /**
     * 
     * @type {string}
     * @memberof SearchTrackFull
     */
    parentalWarningType?: string;
    /**
     * Whether or not the owner has restricted streaming behind an access gate
     * @type {boolean}
     * @memberof SearchTrackFull
     */
    isStreamGated: boolean;
    /**
     * How to unlock stream access to the track
     * @type {AccessGate}
     * @memberof SearchTrackFull
     */
    streamConditions?: AccessGate;
    /**
     * Whether or not the owner has restricted downloading behind an access gate
     * @type {boolean}
     * @memberof SearchTrackFull
     */
    isDownloadGated: boolean;
    /**
     * How to unlock the track download
     * @type {AccessGate}
     * @memberof SearchTrackFull
     */
    downloadConditions?: AccessGate;
    /**
     * 
     * @type {number}
     * @memberof SearchTrackFull
     */
    pinnedCommentId?: number;
}

/**
 * Check if a given object implements the SearchTrackFull interface.
 */
export function instanceOfSearchTrackFull(value: object): value is SearchTrackFull {
    let isInstance = true;
    isInstance = isInstance && "artwork" in value && value["artwork"] !== undefined;
    isInstance = isInstance && "genre" in value && value["genre"] !== undefined;
    isInstance = isInstance && "id" in value && value["id"] !== undefined;
    isInstance = isInstance && "isOriginalAvailable" in value && value["isOriginalAvailable"] !== undefined;
    isInstance = isInstance && "remixOf" in value && value["remixOf"] !== undefined;
    isInstance = isInstance && "repostCount" in value && value["repostCount"] !== undefined;
    isInstance = isInstance && "favoriteCount" in value && value["favoriteCount"] !== undefined;
    isInstance = isInstance && "commentCount" in value && value["commentCount"] !== undefined;
    isInstance = isInstance && "title" in value && value["title"] !== undefined;
    isInstance = isInstance && "user" in value && value["user"] !== undefined;
    isInstance = isInstance && "duration" in value && value["duration"] !== undefined;
    isInstance = isInstance && "isDownloadable" in value && value["isDownloadable"] !== undefined;
    isInstance = isInstance && "playCount" in value && value["playCount"] !== undefined;
    isInstance = isInstance && "permalink" in value && value["permalink"] !== undefined;
    isInstance = isInstance && "access" in value && value["access"] !== undefined;
    isInstance = isInstance && "blocknumber" in value && value["blocknumber"] !== undefined;
    isInstance = isInstance && "coverArtSizes" in value && value["coverArtSizes"] !== undefined;
    isInstance = isInstance && "createdAt" in value && value["createdAt"] !== undefined;
    isInstance = isInstance && "fieldVisibility" in value && value["fieldVisibility"] !== undefined;
    isInstance = isInstance && "hasCurrentUserReposted" in value && value["hasCurrentUserReposted"] !== undefined;
    isInstance = isInstance && "isScheduledRelease" in value && value["isScheduledRelease"] !== undefined;
    isInstance = isInstance && "isUnlisted" in value && value["isUnlisted"] !== undefined;
    isInstance = isInstance && "hasCurrentUserSaved" in value && value["hasCurrentUserSaved"] !== undefined;
    isInstance = isInstance && "routeId" in value && value["routeId"] !== undefined;
    isInstance = isInstance && "trackSegments" in value && value["trackSegments"] !== undefined;
    isInstance = isInstance && "updatedAt" in value && value["updatedAt"] !== undefined;
    isInstance = isInstance && "userId" in value && value["userId"] !== undefined;
    isInstance = isInstance && "isDelete" in value && value["isDelete"] !== undefined;
    isInstance = isInstance && "isAvailable" in value && value["isAvailable"] !== undefined;
    isInstance = isInstance && "isStreamGated" in value && value["isStreamGated"] !== undefined;
    isInstance = isInstance && "isDownloadGated" in value && value["isDownloadGated"] !== undefined;

    return isInstance;
}

export function SearchTrackFullFromJSON(json: any): SearchTrackFull {
    return SearchTrackFullFromJSONTyped(json, false);
}

export function SearchTrackFullFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchTrackFull {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'artwork': TrackArtworkFromJSON(json['artwork']),
        'description': !exists(json, 'description') ? undefined : json['description'],
        'genre': json['genre'],
        'id': json['id'],
        'trackCid': !exists(json, 'track_cid') ? undefined : json['track_cid'],
        'previewCid': !exists(json, 'preview_cid') ? undefined : json['preview_cid'],
        'origFileCid': !exists(json, 'orig_file_cid') ? undefined : json['orig_file_cid'],
        'origFilename': !exists(json, 'orig_filename') ? undefined : json['orig_filename'],
        'isOriginalAvailable': json['is_original_available'],
        'mood': !exists(json, 'mood') ? undefined : json['mood'],
        'releaseDate': !exists(json, 'release_date') ? undefined : json['release_date'],
        'remixOf': FullRemixParentFromJSON(json['remix_of']),
        'repostCount': json['repost_count'],
        'favoriteCount': json['favorite_count'],
        'commentCount': json['comment_count'],
        'tags': !exists(json, 'tags') ? undefined : json['tags'],
        'title': json['title'],
        'user': UserFullFromJSON(json['user']),
        'duration': json['duration'],
        'isDownloadable': json['is_downloadable'],
        'playCount': json['play_count'],
        'permalink': json['permalink'],
        'isStreamable': !exists(json, 'is_streamable') ? undefined : json['is_streamable'],
        'ddexApp': !exists(json, 'ddex_app') ? undefined : json['ddex_app'],
        'playlistsContainingTrack': !exists(json, 'playlists_containing_track') ? undefined : json['playlists_containing_track'],
        'pinnedCommentId': !exists(json, 'pinned_comment_id') ? undefined : json['pinned_comment_id'],
        'access': AccessFromJSON(json['access']),
        'blocknumber': json['blocknumber'],
        'createDate': !exists(json, 'create_date') ? undefined : json['create_date'],
        'coverArtSizes': json['cover_art_sizes'],
        'coverArtCids': !exists(json, 'cover_art_cids') ? undefined : CoverArtFromJSON(json['cover_art_cids']),
        'createdAt': json['created_at'],
        'creditsSplits': !exists(json, 'credits_splits') ? undefined : json['credits_splits'],
        'isrc': !exists(json, 'isrc') ? undefined : json['isrc'],
        'license': !exists(json, 'license') ? undefined : json['license'],
        'iswc': !exists(json, 'iswc') ? undefined : json['iswc'],
        'fieldVisibility': FieldVisibilityFromJSON(json['field_visibility']),
        'followeeReposts': !exists(json, 'followee_reposts') ? undefined : ((json['followee_reposts'] as Array<any>).map(RepostFromJSON)),
        'hasCurrentUserReposted': json['has_current_user_reposted'],
        'isScheduledRelease': json['is_scheduled_release'],
        'isUnlisted': json['is_unlisted'],
        'hasCurrentUserSaved': json['has_current_user_saved'],
        'followeeFavorites': !exists(json, 'followee_favorites') ? undefined : ((json['followee_favorites'] as Array<any>).map(FavoriteFromJSON)),
        'routeId': json['route_id'],
        'stemOf': !exists(json, 'stem_of') ? undefined : StemParentFromJSON(json['stem_of']),
        'trackSegments': ((json['track_segments'] as Array<any>).map(TrackSegmentFromJSON)),
        'updatedAt': json['updated_at'],
        'userId': json['user_id'],
        'isDelete': json['is_delete'],
        'coverArt': !exists(json, 'cover_art') ? undefined : json['cover_art'],
        'isAvailable': json['is_available'],
        'aiAttributionUserId': !exists(json, 'ai_attribution_user_id') ? undefined : json['ai_attribution_user_id'],
        'allowedApiKeys': !exists(json, 'allowed_api_keys') ? undefined : json['allowed_api_keys'],
        'audioUploadId': !exists(json, 'audio_upload_id') ? undefined : json['audio_upload_id'],
        'previewStartSeconds': !exists(json, 'preview_start_seconds') ? undefined : json['preview_start_seconds'],
        'bpm': !exists(json, 'bpm') ? undefined : json['bpm'],
        'isCustomBpm': !exists(json, 'is_custom_bpm') ? undefined : json['is_custom_bpm'],
        'musicalKey': !exists(json, 'musical_key') ? undefined : json['musical_key'],
        'isCustomMusicalKey': !exists(json, 'is_custom_musical_key') ? undefined : json['is_custom_musical_key'],
        'audioAnalysisErrorCount': !exists(json, 'audio_analysis_error_count') ? undefined : json['audio_analysis_error_count'],
        'commentsDisabled': !exists(json, 'comments_disabled') ? undefined : json['comments_disabled'],
        'ddexReleaseIds': !exists(json, 'ddex_release_ids') ? undefined : json['ddex_release_ids'],
        'artists': !exists(json, 'artists') ? undefined : json['artists'],
        'resourceContributors': !exists(json, 'resource_contributors') ? undefined : json['resource_contributors'],
        'indirectResourceContributors': !exists(json, 'indirect_resource_contributors') ? undefined : json['indirect_resource_contributors'],
        'rightsController': !exists(json, 'rights_controller') ? undefined : json['rights_controller'],
        'copyrightLine': !exists(json, 'copyright_line') ? undefined : json['copyright_line'],
        'producerCopyrightLine': !exists(json, 'producer_copyright_line') ? undefined : json['producer_copyright_line'],
        'parentalWarningType': !exists(json, 'parental_warning_type') ? undefined : json['parental_warning_type'],
        'isStreamGated': json['is_stream_gated'],
        'streamConditions': !exists(json, 'stream_conditions') ? undefined : AccessGateFromJSON(json['stream_conditions']),
        'isDownloadGated': json['is_download_gated'],
        'downloadConditions': !exists(json, 'download_conditions') ? undefined : AccessGateFromJSON(json['download_conditions']),
        'pinnedCommentId': !exists(json, 'pinned_comment_id') ? undefined : json['pinned_comment_id'],
    };
}

export function SearchTrackFullToJSON(value?: SearchTrackFull | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'artwork': TrackArtworkToJSON(value.artwork),
        'description': value.description,
        'genre': value.genre,
        'id': value.id,
        'track_cid': value.trackCid,
        'preview_cid': value.previewCid,
        'orig_file_cid': value.origFileCid,
        'orig_filename': value.origFilename,
        'is_original_available': value.isOriginalAvailable,
        'mood': value.mood,
        'release_date': value.releaseDate,
        'remix_of': FullRemixParentToJSON(value.remixOf),
        'repost_count': value.repostCount,
        'favorite_count': value.favoriteCount,
        'comment_count': value.commentCount,
        'tags': value.tags,
        'title': value.title,
        'user': UserFullToJSON(value.user),
        'duration': value.duration,
        'is_downloadable': value.isDownloadable,
        'play_count': value.playCount,
        'permalink': value.permalink,
        'is_streamable': value.isStreamable,
        'ddex_app': value.ddexApp,
        'playlists_containing_track': value.playlistsContainingTrack,
        'pinned_comment_id': value.pinnedCommentId,
        'access': AccessToJSON(value.access),
        'blocknumber': value.blocknumber,
        'create_date': value.createDate,
        'cover_art_sizes': value.coverArtSizes,
        'cover_art_cids': CoverArtToJSON(value.coverArtCids),
        'created_at': value.createdAt,
        'credits_splits': value.creditsSplits,
        'isrc': value.isrc,
        'license': value.license,
        'iswc': value.iswc,
        'field_visibility': FieldVisibilityToJSON(value.fieldVisibility),
        'followee_reposts': value.followeeReposts === undefined ? undefined : ((value.followeeReposts as Array<any>).map(RepostToJSON)),
        'has_current_user_reposted': value.hasCurrentUserReposted,
        'is_scheduled_release': value.isScheduledRelease,
        'is_unlisted': value.isUnlisted,
        'has_current_user_saved': value.hasCurrentUserSaved,
        'followee_favorites': value.followeeFavorites === undefined ? undefined : ((value.followeeFavorites as Array<any>).map(FavoriteToJSON)),
        'route_id': value.routeId,
        'stem_of': StemParentToJSON(value.stemOf),
        'track_segments': ((value.trackSegments as Array<any>).map(TrackSegmentToJSON)),
        'updated_at': value.updatedAt,
        'user_id': value.userId,
        'is_delete': value.isDelete,
        'cover_art': value.coverArt,
        'is_available': value.isAvailable,
        'ai_attribution_user_id': value.aiAttributionUserId,
        'allowed_api_keys': value.allowedApiKeys,
        'audio_upload_id': value.audioUploadId,
        'preview_start_seconds': value.previewStartSeconds,
        'bpm': value.bpm,
        'is_custom_bpm': value.isCustomBpm,
        'musical_key': value.musicalKey,
        'is_custom_musical_key': value.isCustomMusicalKey,
        'audio_analysis_error_count': value.audioAnalysisErrorCount,
        'comments_disabled': value.commentsDisabled,
        'ddex_release_ids': value.ddexReleaseIds,
        'artists': value.artists,
        'resource_contributors': value.resourceContributors,
        'indirect_resource_contributors': value.indirectResourceContributors,
        'rights_controller': value.rightsController,
        'copyright_line': value.copyrightLine,
        'producer_copyright_line': value.producerCopyrightLine,
        'parental_warning_type': value.parentalWarningType,
        'is_stream_gated': value.isStreamGated,
        'stream_conditions': AccessGateToJSON(value.streamConditions),
        'is_download_gated': value.isDownloadGated,
        'download_conditions': AccessGateToJSON(value.downloadConditions),
        'pinned_comment_id': value.pinnedCommentId,
    };
}


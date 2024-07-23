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
import type { ActivityFull } from './ActivityFull';
import {
    ActivityFullFromJSON,
    ActivityFullFromJSONTyped,
    ActivityFullToJSON,
} from './ActivityFull';
import type { TrackFull } from './TrackFull';
import {
    TrackFullFromJSON,
    TrackFullFromJSONTyped,
    TrackFullToJSON,
} from './TrackFull';

/**
 * 
 * @export
 * @interface TrackActivityFull
 */
export interface TrackActivityFull extends ActivityFull {
    /**
     * 
     * @type {TrackFull}
     * @memberof TrackActivityFull
     */
    item: TrackFull;
}



/**
 * Check if a given object implements the TrackActivityFull interface.
 */
export function instanceOfTrackActivityFull(value: object): value is TrackActivityFull {
    let isInstance = true;
    isInstance = isInstance && "item" in value && value["item"] !== undefined;

    return isInstance;
}

export function TrackActivityFullFromJSON(json: any): TrackActivityFull {
    return TrackActivityFullFromJSONTyped(json, false);
}

export function TrackActivityFullFromJSONTyped(json: any, ignoreDiscriminator: boolean): TrackActivityFull {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        ...ActivityFullFromJSONTyped(json, ignoreDiscriminator),
        'item': TrackFullFromJSON(json['item']),
    };
}

export function TrackActivityFullToJSON(value?: TrackActivityFull | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        ...ActivityFullToJSON(value),
        'item': TrackFullToJSON(value.item),
    };
}


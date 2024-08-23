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
import type { ReceiveTipNotificationAction } from './ReceiveTipNotificationAction';
import {
    ReceiveTipNotificationActionFromJSON,
    ReceiveTipNotificationActionFromJSONTyped,
    ReceiveTipNotificationActionToJSON,
} from './ReceiveTipNotificationAction';

/**
 * 
 * @export
 * @interface ReceiveTipNotification
 */
export interface ReceiveTipNotification {
    /**
     * 
     * @type {string}
     * @memberof ReceiveTipNotification
     */
    type: string;
    /**
     * 
     * @type {string}
     * @memberof ReceiveTipNotification
     */
    groupId: string;
    /**
     * 
     * @type {boolean}
     * @memberof ReceiveTipNotification
     */
    isSeen: boolean;
    /**
     * 
     * @type {number}
     * @memberof ReceiveTipNotification
     */
    seenAt?: number;
    /**
     * 
     * @type {Array<ReceiveTipNotificationAction>}
     * @memberof ReceiveTipNotification
     */
    actions: Array<ReceiveTipNotificationAction>;
}

/**
 * Check if a given object implements the ReceiveTipNotification interface.
 */
export function instanceOfReceiveTipNotification(value: object): value is ReceiveTipNotification {
    let isInstance = true;
    isInstance = isInstance && "type" in value && value["type"] !== undefined;
    isInstance = isInstance && "groupId" in value && value["groupId"] !== undefined;
    isInstance = isInstance && "isSeen" in value && value["isSeen"] !== undefined;
    isInstance = isInstance && "actions" in value && value["actions"] !== undefined;

    return isInstance;
}

export function ReceiveTipNotificationFromJSON(json: any): ReceiveTipNotification {
    return ReceiveTipNotificationFromJSONTyped(json, false);
}

export function ReceiveTipNotificationFromJSONTyped(json: any, ignoreDiscriminator: boolean): ReceiveTipNotification {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'type': json['type'],
        'groupId': json['group_id'],
        'isSeen': json['is_seen'],
        'seenAt': !exists(json, 'seen_at') ? undefined : json['seen_at'],
        'actions': ((json['actions'] as Array<any>).map(ReceiveTipNotificationActionFromJSON)),
    };
}

export function ReceiveTipNotificationToJSON(value?: ReceiveTipNotification | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'type': value.type,
        'group_id': value.groupId,
        'is_seen': value.isSeen,
        'seen_at': value.seenAt,
        'actions': ((value.actions as Array<any>).map(ReceiveTipNotificationActionToJSON)),
    };
}


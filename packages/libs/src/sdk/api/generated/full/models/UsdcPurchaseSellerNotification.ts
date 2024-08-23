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
import type { UsdcPurchaseSellerNotificationAction } from './UsdcPurchaseSellerNotificationAction';
import {
    UsdcPurchaseSellerNotificationActionFromJSON,
    UsdcPurchaseSellerNotificationActionFromJSONTyped,
    UsdcPurchaseSellerNotificationActionToJSON,
} from './UsdcPurchaseSellerNotificationAction';

/**
 * 
 * @export
 * @interface UsdcPurchaseSellerNotification
 */
export interface UsdcPurchaseSellerNotification {
    /**
     * 
     * @type {string}
     * @memberof UsdcPurchaseSellerNotification
     */
    type: string;
    /**
     * 
     * @type {string}
     * @memberof UsdcPurchaseSellerNotification
     */
    groupId: string;
    /**
     * 
     * @type {boolean}
     * @memberof UsdcPurchaseSellerNotification
     */
    isSeen: boolean;
    /**
     * 
     * @type {number}
     * @memberof UsdcPurchaseSellerNotification
     */
    seenAt?: number;
    /**
     * 
     * @type {Array<UsdcPurchaseSellerNotificationAction>}
     * @memberof UsdcPurchaseSellerNotification
     */
    actions: Array<UsdcPurchaseSellerNotificationAction>;
}

/**
 * Check if a given object implements the UsdcPurchaseSellerNotification interface.
 */
export function instanceOfUsdcPurchaseSellerNotification(value: object): value is UsdcPurchaseSellerNotification {
    let isInstance = true;
    isInstance = isInstance && "type" in value && value["type"] !== undefined;
    isInstance = isInstance && "groupId" in value && value["groupId"] !== undefined;
    isInstance = isInstance && "isSeen" in value && value["isSeen"] !== undefined;
    isInstance = isInstance && "actions" in value && value["actions"] !== undefined;

    return isInstance;
}

export function UsdcPurchaseSellerNotificationFromJSON(json: any): UsdcPurchaseSellerNotification {
    return UsdcPurchaseSellerNotificationFromJSONTyped(json, false);
}

export function UsdcPurchaseSellerNotificationFromJSONTyped(json: any, ignoreDiscriminator: boolean): UsdcPurchaseSellerNotification {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'type': json['type'],
        'groupId': json['group_id'],
        'isSeen': json['is_seen'],
        'seenAt': !exists(json, 'seen_at') ? undefined : json['seen_at'],
        'actions': ((json['actions'] as Array<any>).map(UsdcPurchaseSellerNotificationActionFromJSON)),
    };
}

export function UsdcPurchaseSellerNotificationToJSON(value?: UsdcPurchaseSellerNotification | null): any {
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
        'actions': ((value.actions as Array<any>).map(UsdcPurchaseSellerNotificationActionToJSON)),
    };
}


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
/**
 * 
 * @export
 * @interface SaveOfRepostNotificationActionData
 */
export interface SaveOfRepostNotificationActionData {
    /**
     * 
     * @type {string}
     * @memberof SaveOfRepostNotificationActionData
     */
    type: SaveOfRepostNotificationActionDataTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof SaveOfRepostNotificationActionData
     */
    userId: string;
    /**
     * 
     * @type {string}
     * @memberof SaveOfRepostNotificationActionData
     */
    saveOfRepostItemId: string;
}


/**
 * @export
 */
export const SaveOfRepostNotificationActionDataTypeEnum = {
    Track: 'track',
    Playlist: 'playlist',
    Album: 'album'
} as const;
export type SaveOfRepostNotificationActionDataTypeEnum = typeof SaveOfRepostNotificationActionDataTypeEnum[keyof typeof SaveOfRepostNotificationActionDataTypeEnum];


/**
 * Check if a given object implements the SaveOfRepostNotificationActionData interface.
 */
export function instanceOfSaveOfRepostNotificationActionData(value: object): value is SaveOfRepostNotificationActionData {
    let isInstance = true;
    isInstance = isInstance && "type" in value && value["type"] !== undefined;
    isInstance = isInstance && "userId" in value && value["userId"] !== undefined;
    isInstance = isInstance && "saveOfRepostItemId" in value && value["saveOfRepostItemId"] !== undefined;

    return isInstance;
}

export function SaveOfRepostNotificationActionDataFromJSON(json: any): SaveOfRepostNotificationActionData {
    return SaveOfRepostNotificationActionDataFromJSONTyped(json, false);
}

export function SaveOfRepostNotificationActionDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): SaveOfRepostNotificationActionData {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'type': json['type'],
        'userId': json['user_id'],
        'saveOfRepostItemId': json['save_of_repost_item_id'],
    };
}

export function SaveOfRepostNotificationActionDataToJSON(value?: SaveOfRepostNotificationActionData | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'type': value.type,
        'user_id': value.userId,
        'save_of_repost_item_id': value.saveOfRepostItemId,
    };
}


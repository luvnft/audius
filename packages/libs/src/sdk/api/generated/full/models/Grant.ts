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
 * @interface Grant
 */
export interface Grant {
    /**
     * 
     * @type {string}
     * @memberof Grant
     */
    granteeAddress: string;
    /**
     * 
     * @type {string}
     * @memberof Grant
     */
    userId: string;
    /**
     * 
     * @type {boolean}
     * @memberof Grant
     */
    isRevoked: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Grant
     */
    isApproved: boolean;
    /**
     * 
     * @type {string}
     * @memberof Grant
     */
    createdAt: string;
    /**
     * 
     * @type {string}
     * @memberof Grant
     */
    updatedAt: string;
}

/**
 * Check if a given object implements the Grant interface.
 */
export function instanceOfGrant(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "granteeAddress" in value;
    isInstance = isInstance && "userId" in value;
    isInstance = isInstance && "isRevoked" in value;
    isInstance = isInstance && "isApproved" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "updatedAt" in value;

    return isInstance;
}

export function GrantFromJSON(json: any): Grant {
    return GrantFromJSONTyped(json, false);
}

export function GrantFromJSONTyped(json: any, ignoreDiscriminator: boolean): Grant {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'granteeAddress': json['grantee_address'],
        'userId': json['user_id'],
        'isRevoked': json['is_revoked'],
        'isApproved': json['is_approved'],
        'createdAt': json['created_at'],
        'updatedAt': json['updated_at'],
    };
}

export function GrantToJSON(value?: Grant | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'grantee_address': value.granteeAddress,
        'user_id': value.userId,
        'is_revoked': value.isRevoked,
        'is_approved': value.isApproved,
        'created_at': value.createdAt,
        'updated_at': value.updatedAt,
    };
}

